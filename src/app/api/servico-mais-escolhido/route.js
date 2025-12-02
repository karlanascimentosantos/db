import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        s.nome AS servico,
        COUNT(a.id_servico) AS quantidade
      FROM agendamento a
      JOIN servico s ON s.id = a.id_servico
      GROUP BY s.nome
      ORDER BY quantidade DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ servico: null });
    }

    return NextResponse.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    client.release();
  }
}
