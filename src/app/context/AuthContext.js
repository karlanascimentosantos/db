'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [needsRefresh, setNeedsRefresh] = useState(false) // 👈 adicionamos isso

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
    <AuthContext.Provider
      value={{
        usuarioLogado,
        setUsuarioLogado,
        needsRefresh,        // 👈 exporta para o resto do app
        setNeedsRefresh,     // 👈 exporta a função para atualizar
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
