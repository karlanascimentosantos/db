
'use client'

import { useState, useEffect } from 'react';
import style from './styles.module.css';


export default function ClienteList({ clientes, onDeleteConsumidor }) {
  const [list, setList] = useState(clientes || []);
  const [needsRefresh, setNeedsRefresh] = useState(false);


  useEffect(() => {
    setList(clientes);
  }, [clientes]);

  const toggleConcluido = async (id, currentValue) => {
    const newValue = !currentValue;

    setList((prev) =>
      prev.map((item) =>
        item.agendamentoid === id ? { ...item, concluido: newValue } : item
      )
    );



    try {
      const res = await fetch('/api/agendamento', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendamentoid: id, concluido: newValue }),
      });

      if (!res.ok) throw new Error('Falha ao atualizar o banco');

      const updated = await res.json();

      setList((prev) =>
        prev.map((item) =>
          item.agendamentoid === updated.agendamentoid ? updated : item
        )
      );
      
      setNeedsRefresh(true);
      
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);

     
      setList((prev) =>
        prev.map((item) =>
          item.agendamentoid === id ? { ...item, concluido: currentValue } : item
        )
      );
    }
  };

  const handleAvaliacao = async (id, value) => {
    setList((prev) =>
      prev.map((item) =>
      item.agendamentoid === id ? { ...item, avaliacao: value} : item)
    );



    try {
      const res = await fetch('/api/agendamento', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ agendamentoid: id, avaliacao: value}),
      });

      if (!res.ok) throw new Error('Erro ao salvar avaliação'); 
    } catch (error) {
      console.error('Erro ao atualizar avaliação', error);
    }
  };

  return (
    <ul>
      {list.map((agendamento) => (
        <li className={style.list} key={agendamento.agendamentoid}>
          <div className={style.containerr}>
            <div className={style.icon}>
              <img src="bigode.png" alt="icone de serviço" />
            </div>

            <div className={style.info}>
              <span className={style.date}>
                {new Date(agendamento.datahora).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
                {' - '}
                {agendamento.servico}
                <div
                  className={
                    agendamento.concluido?
                       style.concluidoVerde
                      : style.pendenteVermelho
                  }
                >
                  {agendamento.concluido ? 'Concluído' : 'Pendente'}
                </div>
              </span>

              {agendamento.concluido && (
                <div className={style.stars}> 
  {[1, 2, 3, 4, 5].map((num) => (
    <span
      key={num}
      className={
        num <= (agendamento.avaliacao || 0)
          ? style.starAtiva
          : style.star
      } 
      onClick={() => handleAvaliacao(agendamento.agendamentoid, num)}
    >
      ★
    </span>
  ))}
</div>

              )}
            </div>

            <form>
              <input
                className={style.check}
                type="checkbox"
                checked={agendamento.concluido ?? false}
                onChange={() =>
                  toggleConcluido(agendamento.agendamentoid, agendamento.concluido)
                }
              />
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
