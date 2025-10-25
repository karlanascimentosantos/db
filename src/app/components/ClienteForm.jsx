
'use client'
import { useState, useEffect } from 'react'
import style from "./styles.module.css"

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
    if (!dataSelecionada) { setHorarios([]); return }
    const res = await fetch(`/api/horarios?data=${dataSelecionada}`)
    const json = await res.json()
    setHorarios(Array.isArray(json.horariosDisponiveis) ? json.horariosDisponiveis : [])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!servicoId) return alert('Selecione um serviço')
    if (!data || !hora) return alert('Selecione a data e o horário')
    const datahora = `${data} ${hora}:00`
    onAddAgendamento({ id_servico: servicoId, datahora })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className={style.servicoT}>Qual o serviço de hoje?</label>
      <select className={style.selecioneS} value={servicoId} onChange={e => setServicoId(e.target.value)}>
        <option value="">Selecione um serviço</option>
        {servico.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
      </select>

      
      <input className={style.dataLabel} type="date" value={data} onChange={e => fetchHorarios(e.target.value)} />

      <label className={style.horarioD}>Escolha um Horário disponível:</label>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {horarios.length === 0 && <li className={style.dataS}> Selecione uma data</li>}
        {horarios.map(h => (
          <li className={style.escolherH} key={h} onClick={() => setHora(h)}
              style={{ cursor: 'pointer !important', fontWeight: h===hora?'bold':'normal', color: h===hora?'#e9ca4f': 'inherit' }}>{h}</li>
        ))}
      </ul>

      <button className={style.botao} type="submit">Agendar</button>
    </form>
  )
}
