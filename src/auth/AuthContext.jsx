import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const TOKEN_STORAGE_KEY = 'ats_token'

function readInitialToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readInitialToken)

  const setSession = useCallback((newToken) => {
    setToken(newToken)
    try {
      if (newToken) sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken)
      else sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch {
      // ignore storage errors (e.g., disabled storage)
    }
  }, [])

  const login = useCallback(
    (newToken) => {
      setSession(newToken)
    },
    [setSession],
  )

  const logout = useCallback(() => {
    setSession(null)
  }, [setSession])

  const value = useMemo(() => ({ token, login, logout }), [token, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

