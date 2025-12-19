import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ano = searchParams.get("ano");

  if (!ano) {
    return NextResponse.json(
      { error: "ano é obrigatório" },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT 
        a.agendamentoid,
        a.datahora,
        a.avaliacao,
        s.nome AS servico
      FROM agendamento a
      JOIN servico s ON a.id_servico = s.id
      WHERE EXTRACT(YEAR FROM a.datahora) = $1
      ORDER BY a.datahora ASC
      `,
      [ano]
    );

    const mediaResult = await client.query(
      `
      SELECT AVG(a.avaliacao) AS media
      FROM agendamento a
      WHERE EXTRACT(YEAR FROM a.datahora) = $1
      `,
      [ano]
    );

    const avaliacaoGeral = mediaResult.rows[0].media;

    client.release();

    const meses = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];

    const agrupado = meses.map((nomeMes, idx) => ({
      mes: idx + 1,
      nome: nomeMes,
      itens: []
    }));

    result.rows.forEach(r => {
      const d = new Date(r.datahora);
      const mes = d.getMonth();

      agrupado[mes].itens.push({
        ...r,
        horario: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        data: d.toLocaleDateString("pt-BR"),
      });
    });

    return NextResponse.json({
      total: result.rowCount,
      meses: agrupado,
      agendamentos: result.rows,
      avaliacaoGeral: avaliacaoGeral ? Number(avaliacaoGeral) : null,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
