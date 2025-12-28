import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const authRouter = express.Router()

/**
 * Initiates Google OAuth login flow
 */
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

/**
 * Google OAuth callback endpoint - handles the redirect from Google
 */
authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session        : false,
  }),
  (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.redirect(`${process.env.FRONTEND_URL}/auth/google-callback?token=${token}`)
  },
)

/**
 * Authentication failure endpoint
 */
authRouter.get('/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth?error=authentication_failed`)
})

export default authRouter