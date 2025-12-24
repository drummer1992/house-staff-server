import dotenv from 'dotenv'

dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import knex from '../db/knex.js'
import compact from 'lodash.compact'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey   : process.env.JWT_SECRET,
}

const jwtStrategy = new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
  try {
    const [user] = await knex.client.select('*').from('Users')
      .where({ id: jwtPayload.id })

    if (user) return done(null, user)
    return done(null, false)
  } catch (err) {
    return done(err, false)
  }
})

passport.use(jwtStrategy)

passport.use(
  new GoogleStrategy(
    {
      clientID    : process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL : process.env.GOOGLE_CALLBACK_URL,
      scope       : ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id   : profile.id,
          email: profile.emails[0].value,
          name : compact([profile.displayName, profile.name.givenName, profile.name.familyName]).join(' '),
        }

        const { count } = await knex.client.count()
          .from('Users').where({ id: profile.id })
          .first()

        if (!Number(count)) {
          await knex.client.insert(user).into('Users')
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})

export default passport

