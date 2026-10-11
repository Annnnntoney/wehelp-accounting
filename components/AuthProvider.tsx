'use client'

import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getFirebase } from '@/lib/firebase'

interface AuthState {
  /** undefined：還不知道（Firebase 正在讀上次的登入資訊）；null：沒登入 */
  user: User | null | undefined
}

const AuthContext = createContext<AuthState>({ user: undefined })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => onAuthStateChanged(getFirebase().auth, setUser), [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
