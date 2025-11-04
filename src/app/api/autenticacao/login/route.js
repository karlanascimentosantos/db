
import { NextResponse } from 'next/server'
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, senha } = await request.json()

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM consumidor WHERE email = $1',
        [email]
      )

      const user = result.rows[0]

      if (!user) {
        return NextResponse.json(
          { error: "Usuário ou senha inválido. Tente novamente" },
          { status: 401 }
        )
      }

      const senhaValida = await bcrypt.compare(senha, user.senha_hash);
      if (!senhaValida) {
        return NextResponse.json(
          { error: "Usuário ou senha inválido. Tente novamente" },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { id: user.id, email: user.email },
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


