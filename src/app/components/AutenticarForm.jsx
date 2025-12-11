import {useState} from 'react'
import style from "./styles.module.css"

export default function AutenticarForm({ onAddConsumidor}) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onAddConsumidor({nome, email, senha})
        setNome(''),
        setEmail(''),
        setSenha('')
    }

    return (
      <form onSubmit={handleSubmit}>

  <label className={style.name} htmlFor="nome"> Nome:</label>
  <br />

  <div className={style.merda}>

  <input className={style.nome}
    type="text"
    value={nome}
    onChange={(e) => setNome(e.target.value)}
    required
  />

  </div>

  <br />
  <label className={style.text} htmlFor="email">Email:</label>
  <br />
    <div className={style.merda}>

  <input className={style.email}
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
    </div>


  <br />
  <label className={style.senha} htmlFor="senha">Senha:</label>
  <br />
  
  <input className={style.password}
    type="password"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
    required
  />

   <br></br>
            <a href="novoLogin"> </a>
            <button className={style.button} type='submit'>
                       Cadastrar

            </button>

</form>

    )

}

