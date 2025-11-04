import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request) {
  try {
    const { nome, email, senha } = await request.json();
    console.log("Recebi do frontend:", nome, email, senha);

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const client = await pool.connect();

    await client.query(
      'INSERT INTO consumidor (nome, email, senha_hash) VALUES ($1, $2, $3)',
      [nome, email, senhaHash]
    );

    client.release();

    return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
  } catch (error) {
  console.error("Erro ao adicionar consumidor:", error.message, error.stack);
  return NextResponse.json({ error: error.message }, { status: 500 });
}

}



export async function GET() {
    try{
        const client = await pool.connect()
        const result = await client.query('SELECT id, nome, email FROM consumidor')
        client.release()
        return NextResponse.json(result.rows)
    } catch (error) {
        console.error('Erro listando consumidores:', error)
        return NextResponse.json({ error: 'Internal server error'}, { status: 500 })
    }
}

