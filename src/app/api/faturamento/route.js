import { NextResponse } from "next/server";
import pool from "../../../lib/db"; 

export async function GET(request) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT COALESCE(SUM(s.preco), 0) AS faturamento
       FROM agendamento a
       JOIN servico s ON a.id_servico = s.id
       WHERE DATE(a.datahora) = CURRENT_DATE`
    );

    const faturamento = parseInt(result.rows[0].faturamento, 10);

    return NextResponse.json({ faturamento });
  } catch (err) {
    console.error("Erro ao buscar faturamento:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    client.release();
  }
}
