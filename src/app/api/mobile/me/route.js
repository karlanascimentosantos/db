import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return NextResponse.json({ erro: "Token ausente." }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ erro: "Token inválido." }, { status: 401 });
    }

    const client = await pool.connect();

    const result = await client.query(
      "SELECT id, nome, email, foto FROM consumidor WHERE id = $1",
      [token]
    );

    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ erro: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      user: result.rows[0],
    });
  } catch (e) {
    console.error("ERRO /api/mobile/me:", e);
    return NextResponse.json({ erro: "Erro interno do servidor." }, { status: 500 });
  }
}
