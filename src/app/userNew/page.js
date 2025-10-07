'use client'

import { useState} from 'react'
import AutenticarForm from '../components/AutenticarForm'
import style from "./page.module.css"
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
   
    
export default function Home() {
    const router = useRouter();
    const addConsumidor = async (consumidor) => {
        const response = await fetch('/api/autenticacao/signup', {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'

            },
            body: JSON.stringify(consumidor)
        })
       if(response.ok) {
           await Swal.fire ({
                   title: "Cadastrado",
                   text: "Cadastro realizado com sucesso",
                   confirmButtonText: "OK",
                   icon: "success",
                   background: "#b59b35",
                   color: "black",
                   iconColor: "rgba(79, 100, 6, 1)",
                   confirmButtonColor: "black",
                      })
        router.push("/novoLogin")
       } else {
        alert("Erro ao cadastrar cliente!");
       }
    };

    return (
        < div >
         <div>
            <h2 className={style.h22}>Bem-Vindo!</h2>
            <p className={style.texto1}>Comece sua experiência com estilo.</p> <br>
            </br>
            <p className={style.texto2}>Crie sua conta e agende seus cortes <br></br>com facilidade e rapidez!</p>


         </div>
        <div className={style.barra}></div>
        <div className={style.barra2}></div>
         
        
        <div className={style.box}>
        <div>
            <h1 className={style.h1}> Sign-up </h1>
            <AutenticarForm onAddConsumidor={addConsumidor}/>
        </div>
        </div>
        </div>
    )
}