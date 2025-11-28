
'use client'

import { useSession } from "next-auth/react";
import style from "./page.module.css"
import { useEffect, useState } from 'react'
import { Calendar, Trash2, MessageCircleQuestionMark, MapPin, CircleUserRound } from "lucide-react"
import Swal from 'sweetalert2'

export default function Perfil() {
  const { data: session, status } = useSession(); 
  const [agendamentos, setAgendamentos] = useState([])
  const [proximo, setProximo] = useState(null)



  const usuarioLogado = session?.user; 


 useEffect(() => {
    if (!usuarioLogado?.id) return;

    (async () => {
      try {
        const response = await fetch(`/api/agendamento?consumidorId=${usuarioLogado.id}`);
        const data = await response.json();
        setAgendamentos(data);

        const agora = new Date();
        const futuros = data.filter(a => new Date(a.datahora) > agora && !a.concluido);
        futuros.sort((a, b) => new Date(a.datahora) - new Date(b.datahora));
        setProximo(futuros[0] || null);
      } catch (error) {
        console.error("Erro ao buscar agendamento", error);
      }
    })();
  }, [usuarioLogado]);

  async function handleDelete(id) {
    if (!id) return alert('ID inválido');

    const confirmDelete = await Swal.fire({
      title: 'Cancelar',
      text: 'Deseja realmente cancelar este agendamento?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      icon: 'warning',
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch('/api/agendamento', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Cancelado', data.message || 'Agendamento cancelado', 'success');

        setAgendamentos(prev => {
          const novos = prev.filter(a => a.agendamentoid !== id);
          const agora = new Date();
          const futuros = novos
            .filter(a => new Date(a.datahora) > agora && !a.concluido)
            .sort((a, b) => new Date(a.datahora) - new Date(b.datahora));
          setProximo(futuros[0] || null);
          return novos;
        });
      } else {
        Swal.fire('Erro', data.error || "Erro ao cancelar serviço", 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Erro', "Erro ao cancelar serviço", 'error');
    }
  }

  if (status === "loading") {
  return <p>Carregando...</p>;
  }

    return (
  <div>
    {!usuarioLogado ? (
      <p>Você não está logado</p>
    ) : (
      <div className={style.perfil}>

        <h1 className={style.nome}>
          BEM VINDO, {usuarioLogado.nome?.toUpperCase()}
        </h1>

        <div className={style.alinhar}>
          <div className={style.quadro}>

            <h2 className={style.tituloCard}>Próximo serviço:</h2>

            {proximo ? (
              <>
                <h1 className={style.servico}>{proximo.servico}</h1>

                <p className={style.data}>
                  {new Date(proximo.datahora).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Intl.DateTimeFormat("pt-BR", { weekday: "long" })
                    .format(new Date(proximo.datahora))
                    .replace(/^\w/, c => c.toUpperCase())}
                </p>

                <p className={style.hora}>
                  {new Date(proximo.datahora).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <button
                 className={style.buttonCancelar}
                 onClick={() => handleDelete(proximo.agendamentoid)}
                 >
                Cancelar Agendamento
                </button>

              </>
            ) : (
              <p className={style.naoTem}>Você não possui serviços agendados.</p>
            )}
          </div>
        </div>

        <div className={style.alinharBotoes}>
          <a href="agendamento" className={style.button}>Agendar</a>
          <a href="historico" className={style.button}>Histórico</a>
        </div>

              <div className={style.barra}></div>


      </div>
    )}
  </div>
);
}
