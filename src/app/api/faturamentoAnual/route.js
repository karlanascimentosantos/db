import { NextResponse } from "next/server";
import pool from "../../../lib/db"; 

export async function GET(request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const ano = searchParams.get("ano") || new Date().getFullYear();

    const result = await client.query(
      `SELECT COALESCE(SUM(s.preco), 0) AS faturamento
       FROM agendamento a
       JOIN servico s ON a.id_servico = s.id
       WHERE EXTRACT(YEAR FROM a.datahora) = $1`,
      [ano]
    );

    const faturamento = parseFloat(result.rows[0].faturamento);

    return NextResponse.json({ faturamento });
  } catch (err) {
    console.error("Erro ao buscar faturamento anual:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    client.release();
  }
}
