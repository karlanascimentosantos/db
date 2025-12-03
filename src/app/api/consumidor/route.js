import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, nome, email, role, 
         FROM consumidor 
         WHERE email = $1`,
        [session.user.email]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 }
        );
      }

      const user = result.rows[0];

      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Acesso negado: não é admin" },
          { status: 403 }
        );
      }

      return NextResponse.json(user);
    } finally {
      client.release();
    }
  } 
  
  
  
  
  
  
  
  
  
  catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
