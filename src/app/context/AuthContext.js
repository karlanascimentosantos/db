'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (usuario) setUsuarioLogado(JSON.parse(usuario))
  }, [])

  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem('usuario', JSON.stringify(usuarioLogado))
    } else {
      localStorage.removeItem('usuario')
    }
  }, [usuarioLogado])

  return (
    <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
