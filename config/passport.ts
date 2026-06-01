import dotenv from 'dotenv'

dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import upsertUser from '../services/users/upsert.js'
import getUserById from '../services/users/get-by-id.js'

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload: { id: string }, done) => {
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
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const user = await upsertUser(profile)

        return done(null, user)
      } catch (error) {
        return done(error as Error, undefined)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user as Express.User)
})

passport.deserializeUser((user, done) => {
  done(null, user as Express.User)
})

export default passport
