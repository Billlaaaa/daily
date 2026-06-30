import { createContext, useContext, useState, useEffect } from 'react'
import { setUserPrefix } from '../hooks/useLocalStorage'

const AuthContext = createContext(null)

const SESSION_KEY = '__mc_session__'

function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage (stored without any user prefix)
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate the session hasn't expired (Google ID tokens expire after 1h,
        // but we store the user object separately — just check it has a sub)
        if (parsed?.sub) {
          setUserPrefix(parsed.sub)
          setUser(parsed)
        }
      }
    } catch {
      // corrupt session — ignore
    }
    setLoading(false)
  }, [])

  const signIn = (credential) => {
    const payload = decodeJwt(credential)
    if (!payload?.sub) return

    const userData = {
      sub:     payload.sub,
      email:   payload.email,
      name:    payload.name,
      picture: payload.picture,
    }

    setUserPrefix(userData.sub)
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY)
    setUserPrefix('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
