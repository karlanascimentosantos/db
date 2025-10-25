
'use client'
import { useAuth } from '../context/AuthContext'
import style from "./page.module.css"
import { useEffect, useState } from 'react'
import { Calendar, Trash2, MessageCircleQuestionMark, MapPin, CircleUserRound } from "lucide-react"
import Swal from 'sweetalert2'

export default function Perfil() {
  const { usuarioLogado, needsRefresh, setNeedsRefresh } = useAuth() 
  const [agendamentos, setAgendamentos] = useState([])
  const [proximo, setProximo] = useState(null)

  async function fetchAgendamentos() {
    try {
      const response = await fetch(`/api/agendamento?consumidorId=${usuarioLogado.id}`)
      const data = await response.json()
      setAgendamentos(data)

      const agora = new Date()
      const futuros = data.filter(a => new Date(a.datahora) > agora && !a.concluido)
      futuros.sort((a, b) => new Date(a.datahora) - new Date(b.datahora))
      setProximo(futuros[0] || null)
    } catch (error) {
      console.error("Erro ao buscar agendamento", error)
    }
  }

  useEffect(() => {
    if (usuarioLogado?.id) fetchAgendamentos()
  }, [usuarioLogado])

  useEffect(() => {
    if (needsRefresh && usuarioLogado?.id) {
      fetchAgendamentos()
      setNeedsRefresh(false)
    }
  }, [needsRefresh, usuarioLogado])

  async function handleDelete(id) {
    if (!id) return alert('ID inválido')

    const confirmDelete = await Swal.fire({ 
      title: 'Cancelar',
      text: 'Deseja realmente cancelar este agendamento?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      icon: 'warning',
    })
    if (!confirmDelete.isConfirmed) return

    try {
      const response = await fetch('/api/agendamento', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        Swal.fire('Cancelado', data.message || 'Agendamento cancelado', 'success')

        setAgendamentos(prev => {
          const novos = prev.filter(a => a.agendamentoid !== id)
          const agora = new Date()
          const futuros = novos.filter(a => new Date(a.datahora) > agora && !a.concluido)
                               .sort((a, b) => new Date(a.datahora) - new Date(b.datahora))
          setProximo(futuros[0] || null)
          return novos
        })
      } else {
        Swal.fire('Erro', data.error || "Erro ao cancelar serviço", 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Erro', "Erro ao cancelar serviço", 'error')
    }
  }

  if (!usuarioLogado) return <p>Você não está logado</p>

  return (
    <div> 
      <h1 className={style.nome}>
        <CircleUserRound size={35} color="#caaa00"/> {usuarioLogado.nome}
      </h1>

      <a href="agendamento" className={style.buttonAgendar}>Agendar Horário</a>
      <a href="historico" className={style.buttonHistorico}>Ver Histórico</a>

      <p className={style.duvida}>Dúvidas? fale comigo no whatsapp</p>
      <a className={style.whats} href="https://wa.me/558394182171?">
        <MessageCircleQuestionMark size={30} color="green" /> Clique aqui!
      </a>

      <div className={style.quadroA}>
        <MapPin size={18} color="black"/>
        <h2 className={style.avisos}>Estamos abertos até o meio dia</h2>
      </div>

      <div className={style.quadroB}></div>
      <div className={style.quadroC}></div>

      <div className={style.quadro}>
        <img src="bigode.png" className={style.img} />

        <div className={style.proximoServico}>
          <h1 className={style.h11}>Seu próximo serviço:</h1>

          {proximo ? (
            <div className={style.detalhes}>
              <h2 className={style.servico}>{proximo.servico}</h2>
              <p className={style.datahora}>
                <Calendar size={18} color="#b59b35" />
                {new Date(proximo.datahora).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                às{" "}
                {new Date(proximo.datahora).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <button className={style.cancelar} onClick={() => handleDelete(proximo?.agendamentoid)}>
                <Trash2 size={17} color="#000000ff" />
                <span> Cancelar</span>
              </button>
            </div>
          ) : (
            <p className={style.naoTem}>Você não possui serviços agendados.</p>
          )}
        </div>
      </div>
    </div>
  )
}
