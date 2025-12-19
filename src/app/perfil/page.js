
'use client'

import { useSession } from "next-auth/react";
import style from "./page.module.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";



function normalizeAgendamentos(lista) {
  const agora = new Date();

  return lista
    .map(a => {
     
      const dataObj = new Date(a.datahora.replace(" ", "T"));
      return { ...a, dataObj };
    })
    .filter(a => a.dataObj >= agora && !a.concluido)
    .sort((a, b) => a.dataObj - b.dataObj);
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const [agendamentos, setAgendamentos] = useState([]);
  const [proximo, setProximo] = useState(null);

  const usuarioLogado = session?.user;

  
  useEffect(() => {
    if (!usuarioLogado?.id) return;

    (async () => {
      try {
        const response = await fetch(`/api/agendamento?consumidorId=${usuarioLogado.id}`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Backend não retornou array", data);
          setAgendamentos([]);
          setProximo(null);
          return;
        }

        setAgendamentos(data);

        const futuros = normalizeAgendamentos(data);
        setProximo(futuros[0] || null);

      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    })();
  }, [usuarioLogado]);

  
  async function handleDelete(id) {
    if (!id) return alert("ID inválido");

    const confirmDelete = await Swal.fire({
      title: "Cancelar Agendamento",
      text: "Deseja realmente cancelar este agendamento?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      icon: "warning",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch("/api/agendamento", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Erro", data.error || "Erro ao cancelar agendamento", "error");
        return;
      }

      Swal.fire("Cancelado", data.message, "success");

      setAgendamentos(prev => {
        const novos = prev.filter(a => a.agendamentoid !== id);

        const futuros = normalizeAgendamentos(novos);
        setProximo(futuros[0] || null);

        return novos;
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Erro", "Erro ao cancelar serviço", "error");
    }
  }

 
  if (status === "loading") return <p>Carregando...</p>;

 
  return (
    <div>
      {!usuarioLogado ? (
        <p>Você não está logado</p>
      ) : (
        <div className={style.perfil}>
          <h1 className={style.nome}>
            BEM VINDO, {usuarioLogado.nome?.toUpperCase()}
          </h1>
          <button 
            onClick={() => signOut({ callbackUrl: "/novoLogin" })} 
            className={style.logout}
                  >
                   Sair
                  </button>


          <div className={style.alinhar}>
            <div className={style.quadro}>
              <h2 className={style.tituloCard}>Próximo Agendamento</h2>

              {proximo ? (
                <>
                  <h1 className={style.servico}>{proximo.servico}</h1>

                  <p className={style.data}>
                    {proximo.dataObj.toLocaleDateString("pt-BR")} –{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      weekday: "long",
                    })
                      .format(proximo.dataObj)
                      .replace(/^\w/, c => c.toUpperCase())}
                  </p>

                  <p className={style.hora}>
                    {proximo.dataObj.toLocaleTimeString("pt-BR", {
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
                <p className={style.naoTem}>Você não tem agendamentos futuros.</p>
              )}
            </div>
          </div>

          <div className={style.alinharBotoes}>
            <a href="/agendamento" className={style.button}>Agendar</a>
            <a href="/historico" className={style.button}>Histórico</a>
          </div>

          <div className={style.barra}></div>
        </div>
      )}
    </div>
  );
}
