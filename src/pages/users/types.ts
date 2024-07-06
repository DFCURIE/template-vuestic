export type UserRole = 'superadmin' | 'admin' | 'member' | 'user'

export type User = {
  id: number
  email: string
  role: UserRole
  avatar: string
  notes: string
}
