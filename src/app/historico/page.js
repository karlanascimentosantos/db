'use client'

import { useState, useEffect } from 'react'
import ClienteList from '@/app/components/ClienteList'
import style from './page.module.css'
import { useAuth } from '../context/AuthContext'

export default function Historico() {
  const [clientes, setClientes] = useState([])
  const { usuarioLogado } = useAuth()

  useEffect(() => {
    if (usuarioLogado?.id) {
      fetchClientes(usuarioLogado.id)
    }
  }, [usuarioLogado])

  const fetchClientes = async (id) => {
    try {
      const response = await fetch(`/api/agendamento?consumidorId=${id}`)
      const data = await response.json()
      setClientes(Array.isArray(data) ? data : data.rows || [])
    } catch (err) {
      console.error("Erro ao buscar histórico:", err)
    }
  }

  return (
    <div>
      <h1 className={style.h1}>Seu histórico</h1>
      <div>
        <ClienteList clientes={clientes} />
      </div>
      <div className={style.barra}></div>
    </div>
  )
}
