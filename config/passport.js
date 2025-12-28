import dotenv from 'dotenv'

dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import upsertUser from '../services/users/upsert.js'
import getUserById from '../services/users/get-by-id.js'

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey   : process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUserById(jwtPayload.id)

        if (user) return done(null, user)

        return done(null, false)
      } catch (err) {
        return done(err, false)
      }
    },
  ),
)

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
        const user = await upsertUser(profile)

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export default passport

