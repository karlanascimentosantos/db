import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM consumidor WHERE email = $1",
      [email]
    );
    client.release();

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

  
    const accessToken = `${user.id}-${Date.now()}`;

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      accessToken
    });

  } catch (err) {
    console.error("Erro login mobile:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
