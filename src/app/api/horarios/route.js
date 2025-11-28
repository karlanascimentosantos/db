import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataSelecionada = searchParams.get("data");

  if (!dataSelecionada) {
    return NextResponse.json({ horariosDisponiveis: [] }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `
        SELECT datahora 
        FROM agendamento 
        WHERE datahora >= $1::date
        AND datahora < ($1::date + INTERVAL '1 day')
      `,
      [dataSelecionada]
    );

    client.release();

    const ocupados = result.rows.map(r => {
      const d = new Date(r.datahora);
      const h = d.getHours().toString().padStart(2, "0");
      const m = d.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    });

    const todosHorarios = [];
    for (let h = 7; h <= 21; h++) {
      todosHorarios.push(`${h.toString().padStart(2, "0")}:00`);
    }

    const horariosDisponiveis = todosHorarios.filter(h => !ocupados.includes(h));

    return NextResponse.json({ horariosDisponiveis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ horariosDisponiveis: [] }, { status: 500 });
  }
}
