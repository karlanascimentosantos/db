
import { NextResponse } from 'next/server'
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const admin = searchParams.get("admin") === "true"
  const clienteId = searchParams.get("clienteId")

  const client = await pool.connect()

  if (admin) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)

    const result = await client.query(
      `SELECT a.agendamentoid, a.datahora, s.nome AS servico, u.nome AS cliente
       FROM agendamento a
       JOIN servico s ON a.id_servico = s.id
       JOIN usuario u ON u.id = a.consumidor_id
       WHERE a.datahora >= $1 AND a.datahora < $2
       ORDER BY a.datahora ASC`,
      [hoje, amanha]
    )

    client.release()
    return NextResponse.json(result.rows)
  }

  if (clienteId) {
    const result = await client.query(
      `SELECT a.agendamentoid, a.datahora, s.nome AS servico
       FROM agendamento a
       JOIN servico s ON a.id_servico = s.id
       WHERE a.consumidor_id = $1
       ORDER BY a.datahora ASC`,
      [clienteId]
    )

    client.release()
    return NextResponse.json(result.rows)
  }

  client.release()
  return NextResponse.json([])
}

export async function POST(request) {
  let client
  try {
    const { consumidor_id, id_servico, datahora } = await request.json()

    if (!consumidor_id || !id_servico || !datahora) {
      return NextResponse.json(
        { error: "consumidor_id, id_servico e datahora são obrigatórios" },
        { status: 400 }
      )
    }

    client = await pool.connect()
    await client.query(
      `INSERT INTO agendamento (consumidor_id, id_servico, datahora)
       VALUES ($1, $2, $3)`,
      [consumidor_id, id_servico, datahora]
    )
    return NextResponse.json({ message: "Agendamento criado com sucesso" }, { status: 201 })
  } catch (err) {
    console.error("Erro ao criar agendamento:", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  } finally {
    if (client) client.release()
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query('DELETE FROM agendamento WHERE agendamentoid = $1', [id]);
    client.release();

    return NextResponse.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    console.error('Erro removendo agendamento:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { agendamentoid, concluido, avaliacao } = await request.json();
  
    if (!agendamentoid) {
      return NextResponse.json(
        { error: "ID do agendamento é obrigatório." },
        { status: 400 }
      );
    }

    const campos = [];
    const valores = [];
    let index = 1;

    if (avaliacao !== undefined) {
      campos.push(`avaliacao = $${index++}`);
      valores.push(avaliacao);
    }

    if (concluido !== undefined) {
      campos.push(`concluido = $${index++}`);
      valores.push(concluido);
    }

    if (campos.length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo válido enviado." },
        { status: 400 }
      );
    }

    valores.push(agendamentoid);

    const client = await pool.connect();
    const result = await client.query(
      `
        UPDATE agendamento
        SET ${campos.join(", ")}
        WHERE agendamentoid = $${index}
        RETURNING *;
      `,
      valores
    );
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento." },
      { status: 500 }
    );
  }
}