import type { User as DomainUser } from './domain.js'

declare global {
  namespace Express {
    // make req.user our domain User
    interface User extends DomainUser {
    }
  }
}

export {}
