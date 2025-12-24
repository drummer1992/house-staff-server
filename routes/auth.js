import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const authRouter = express.Router()

/**
 * GET /auth/google
 * Initiates Google OAuth login flow
 */
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

/**
 * GET /auth/google/callback
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
 * GET /auth/failure
 * Authentication failure endpoint
 */
authRouter.get('/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`)
})

/**
 * GET /auth/user
 * Get current authenticated user
 */
authRouter.get('/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user)
    } else {
      res.status(401).json({
        authenticated: false,
        message      : 'Not authenticated',
      })
    }
  })

/**
 * GET /auth/logout
 * Logout endpoint
 */
authRouter.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' })
      }
      res.clearCookie('connect.sid')
      res.json({ message: 'Logged out successfully' })
    })
  })
})

export default authRouter