'use client'

import { useState, useEffect } from 'react'
import ClienteList from '@/app/components/ClienteList'
import style from './page.module.css'
import { useSession } from 'next-auth/react' 


export default function Historico() {
  const [clientes, setClientes] = useState([])
  const { data: session, status} = useSession()
  const usuarioLogado = session?.user

  const fetchClientes = async (id) => {
    try {
      const response = await fetch(`/api/agendamento?consumidorId=${id}`)
      const data = await response.json()
      setClientes(Array.isArray(data) ? data : data.rows || [])
    } catch (err) {
      console.error("Erro ao buscar histórico:", err)
    }
  }


  useEffect(() => {
    if (usuarioLogado?.id) {
      fetchClientes(usuarioLogado.id)
    }
  }, [usuarioLogado])

  if (status === 'loading') {
    return <p>Carregando...</p>
  }

  if (!usuarioLogado) {
    return <p>Você não está logado</p>
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
