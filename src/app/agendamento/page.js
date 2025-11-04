'use client'
import { useState } from 'react'
import ClienteForm from '../components/ClienteForm'
import { useSession } from 'next-auth/react'
import style from './page.module.css'
import Swal from 'sweetalert2'


export default function Page() {
  const { data: session, status } = useSession()
  

  const handleAddAgendamento = async ({ id_servico, datahora }) => {
    if (status === 'loading') {
      alert('Carregando informações do usuário')
      return
    }

    if (!session?.user) {
      alert('Usuário não logado')
      return
    }

    try {
      const res = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumidor_id: session.user.id,
          id_servico,
          datahora
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro ao salvar agendamento')

      const confirmAgendamento = await Swal.fire ({
        title: "Agendado",
        text: `Agendamento realizado com sucesso para o dia: ${datahora}`,
        confirmButtonText: "OK",
        icon: "success",
        background: "#b59b35",
        color: "black",
        iconColor: "rgba(79, 100, 6, 1)",
        confirmButtonColor: "black",
         
        
      });
     if (!confirmAgendamento.isConfirmed) return;
  
    } catch (err) {
      console.error(err)
      
     Swal.fire ({
       title: 'erro',
       text: "Não foi possível realizar agendamento",
       confirmButtonColor: "OK",
       background: "#b59b35",
        color: "black",
        iconColor: "rgba(79, 100, 6, 1)",
        confirmButtonColor: "black",
      icon: "error"
       

     })
    }
  }

  return (
    <div>
      <h1 className={style.h1}>Agendamento</h1>
      <ClienteForm onAddAgendamento={handleAddAgendamento} />
      
    </div>
  )
}
