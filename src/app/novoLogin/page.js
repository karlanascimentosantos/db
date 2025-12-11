'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react"
import style from "./page.module.css"

export default function ClienteLogin() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push("/perfil")
    }
  }, [session, router])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        senha
      })

      if (res?.ok) {
        router.push("/perfil")
      } else {
        alert("Credenciais inválidas")
      }
    } catch (error) {
      console.error(error)
      alert('Erro de conexão')
    }
  }

  return (
    <div>

      {console.log(style)}
      
      <img src="logo3.png" className={style.logo3} />
      <h2 className={style.h2}>Bem-vindo!</h2>
      <p className={style.texto}>Faça login para acessar a página</p>
      <p className={style.text}>
        Ainda não tem uma conta? <br />
        Cadastre-se e aproveite o melhor da barbearia!
      </p>

      <a href="userNew" className={style.outrapagina}>Cadastrar</a>

      <form onSubmit={handleLogin}>
        <div className={style.box}>
          <h2 className={style.titulo}>Login</h2>

          
          <label className={style.name} htmlFor="email">Email:</label>

          <div className={style.merda}>
          <input 
            
            className={style.nomee}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
    
          />
          <label className={style.senha} htmlFor="senha">Senha:</label>
         
          <input
            className={style.password}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          </div>

        

          <h4 className={style.remember}>Esqueceu a senha?</h4>


          <button
            type="button"
            className={style.googleButton}
            onClick={() => signIn("google")}
          >
            <img
              src="/google.png"
              alt="Google"
              style={{ width: "20px", marginRight: "8px" }}
            />
            Entrar com Google
          </button>
          
          <button className={style.entrar} type="submit">
            Entrar
          </button>

          <div className={style.barra}></div>
          <div className={style.barra2}></div>
        </div>
      </form>
    </div>
  )
}
