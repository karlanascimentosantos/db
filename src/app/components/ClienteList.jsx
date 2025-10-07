
import {useState, useEffect} from 'react';
import style from './styles.module.css'


export default function ClienteList({ clientes, onDeleteConsumidor}) {
  const[list, setList] = useState(clientes || []);

  useEffect(() => {
    setList(clientes);
  }, [clientes]);

  const toggleConcluido = (id) => {
    setList((prev) => prev.map((item) => item.agendamentoid === id ? {...item, concluido: !item.concluido }: item))
  }


  return (
    <ul>
      {list.map((agendamento) => (
        <li className={style.list} key={agendamento.agendamentoid}>  

          <span> 
            {agendamento.servicoNome} - {new Date (agendamento.datahora).toLocaleString('pt-BR',{
              dateStyle: 'short',
              timeStyle: 'short' 
             
            } 
            )} <div className={style.concluido}>{agendamento.concluido ? 'Concluido': ' Pendente'}</div>
           
          </span> 

          <form>
          <input className={style.check}
           type="checkbox"  
           checked={agendamento.concluido ?? false}
            onChange={() => toggleConcluido(agendamento.agendamentoid)}
            style={{ marginLeft: '1600px'}}
          ></input>
          
          </form>
        </li>
      ))}
    </ul>
  )
}
