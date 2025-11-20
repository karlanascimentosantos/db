'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react";
import style from "./page.module.css"

export default function ClienteLogin() {
  const { data: session } = useSession(); // ✔️ AQUI É PERMITIDO

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const route = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        senha
      });

      if (res?.ok) {
        route.push("/perfil");
      } else {
        alert("Credenciais inválidas");
      }
    } catch (error) {
      console.error(error)
      alert('Erro de conexão')
    }
  };

  // ✔️ Se já estiver logado, redireciona
  if (session?.user) {
    route.push("/perfil");
    return <p>Redirecionando...</p>
  }

  return (
    <div>
      <h2 className={style.h2}>Bem-vindo!</h2>
      <p  className={style.texto}> Faça login  para acessar a página </p>
      <p className={style.text}> Ainda não tem uma conta? <br></br>
        Cadastre-se e aproveite o melhor da barbearia!</p>

      <a href="userNew" className={style.outrapagina}>Cadastrar</a>

      <form onSubmit={handleLogin}>
        <div className={style.box}>
          <h2 className={style.titulo}>Login</h2>

          <label className={style.name} htmlFor="email">Email:</label>
          <input
            className={style.nome}
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

          <h4 className={style.remember}>Esqueceu a senha?</h4>

          <button className={style.entrar} type="submit">Entrar</button>
          <div className={style.barra}></div>
          <div className={style.barra2}></div>
        </div>
      </form>
    </div>
  )
}
