import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ano = searchParams.get("ano");

  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        s.nome AS servico,
        COUNT(a.id_servico) AS quantidade
      FROM agendamento a
      JOIN servico s ON s.id = a.id_servico
      WHERE EXTRACT(YEAR FROM a.datahora) = $1::int
      GROUP BY s.nome
      ORDER BY quantidade DESC
      LIMIT 1
    `, [ano]);

    return NextResponse.json(result.rows[0] || { servico: null });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    client.release();
  }
}

