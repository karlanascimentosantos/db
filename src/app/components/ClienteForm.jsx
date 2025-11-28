
'use client'
import { useState, useEffect } from 'react'
import style from "./styles.module.css"
import Swal from 'sweetalert2';


export default function ClienteForm({ onAddAgendamento }) {
  const [servico, setServico] = useState([])
  const [servicoId, setServicoId] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [horarios, setHorarios] = useState([])

  const fetchServicos = async () => {
    const res = await fetch('/api/servicos')
    const data = await res.json()
    setServico(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchServicos() }, [])

  const fetchHorarios = async (dataSelecionada) => {
    setData(dataSelecionada)
    setHora('')
    if (!dataSelecionada) { 
      setHorarios([]); 
      return 
    }

    const res = await fetch(`/api/horarios?data=${dataSelecionada}`)
    const json = await res.json()
    setHorarios(Array.isArray(json.horariosDisponiveis) ? json.horariosDisponiveis : [])
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!servicoId) {
    await Swal.fire({
      title: "Alerta",
      text: "Selecione um serviço",
      confirmButtonText: "Voltar",
      icon: "warning",
      background: "#b59b35",
      color: "black",
      iconColor: "rgba(97, 58, 6, 1)",
      confirmButtonColor: "black",
    })
    return;  
  }

  if (!data || !hora) {
    await Swal.fire({
      title: "Alerta",
      text: "Selecione a data e hora",
      confirmButtonText: "Voltar",
      icon: "warning",
      background: "#b59b35",
      color: "black",
      iconColor: "rgba(97, 58, 6, 1)",
      confirmButtonColor: "black",
    })
    return; 
  }

  const datahora = `${data} ${hora}:00`

  const sucesso = await onAddAgendamento({ id_servico: servicoId, datahora })

  if (sucesso) {
    setServicoId('')
    setData('')
    setHora('')
    setHorarios([])
  }
}


  return (
    <form onSubmit={handleSubmit} className={style.containerAgendamento}>
      
      <div className={style.colunaEsquerda}>
        <label className={style.servicoT}>Qual o serviço de hoje?</label>
        <select className={style.selecioneS} 
                value={servicoId} 
                onChange={e => setServicoId(e.target.value)}>
          <option value="">Selecione um serviço</option>
          {servico.map(s => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>

        <label className={style.servicoD}>Escolha a data</label>
        <input className={style.dataLabel} 
               type="date" 
               value={data} 
               onChange={e => fetchHorarios(e.target.value)} />
      </div>

      <div className={style.colunaDireita}>
        <label className={style.horarioD}>Escolha um Horário disponível:</label>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {horarios.length === 0 && <li className={style.dataS}></li>}

          {horarios.map(h => (
            <li 
              key={h}
              className={style.escolherH}
              onClick={() => setHora(h)}
              style={{
                cursor: 'pointer',
                fontWeight: h === hora ? 'bold' : 'normal',
                color: h === hora ? '#e9ca4f' : 'inherit'
              }}
            >
              {h}
            </li>
          ))}
        </ul>

        <button className={style.botao} type="submit">Agendar</button>
      </div>

    </form>
  )
}
