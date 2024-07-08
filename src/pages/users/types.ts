export type User = {
  id?: number | string
  userId?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  level: string
  role?: UserRole
}

export type UserRole = 'superadmin' | 'admin' | 'member' | 'user'