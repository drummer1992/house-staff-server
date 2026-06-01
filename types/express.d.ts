import type { User as DomainUser } from './domain.js'

declare global {
  namespace Express {
    // Passport assigns the authenticated user to req.user; align it with our domain User.
    interface User extends DomainUser {}
  }
}

export {}
