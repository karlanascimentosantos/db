
import { NextResponse } from 'next/server'
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { nome, senha } = await request.json( )

    const client = await pool.connect()
    try {
    const result = await client.query(
      'SELECT * FROM consumidor WHERE nome = $1 AND senha = $2',
      [nome, senha]
    )

    const user = result.rows[0]

    if(!user) { 
      return NextResponse.json(
        {error: "Usuário ou senha inválido. Tente novamente"},
        {status: 401}
      )
    }
    
    return NextResponse.json(
      { id: user.id, nome: user.nome },
      { status: 200 }
    )

  } finally {
    client.release()
  }
  

  } catch (error) {
    console.error('Erro ao logar consumidor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


