// src/pages/users/types.ts
import { Project } from '../projects/types'

export type UserRole = 'admin' | 'user' | 'owner'

export type User = {
  id: number
  email: string
  role: UserRole
  avatar: string
  projects: Project[]
  notes: string
}
