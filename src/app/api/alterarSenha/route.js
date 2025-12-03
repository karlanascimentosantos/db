import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 
import pool from "@/lib/db"; 

export async function POST(req) { 
  try { 
    const { userId, senhaAtual, novaSenha } = await req.json(); 
    
    if (!userId || !senhaAtual || !novaSenha) { 
      return NextResponse.json( { error: "Dados incompletos." }, { status: 400 } ); 
    } 
    
    const client = await pool.connect(); 
    const result = await client.query( "SELECT senha_hash FROM consumidor WHERE id = $1", [userId] ); 
    const user = result.rows[0]; if (!user) { client.release(); 
      
      return NextResponse.json( { error: "Usuário não encontrado." }, { status: 404 } );
    
    } 
    
    const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha_hash); 
    
    if (!senhaCorreta) { client.release(); 
      return NextResponse.json( { error: "Senha atual incorreta." }, { status: 401 } ); } 
      
      const novaHash = await bcrypt.hash(novaSenha, 10); 

      await client.query( "UPDATE consumidor SET senha_hash = $1 WHERE id = $2", [novaHash, userId] ); 
      client.release(); return NextResponse.json({ message: "Senha alterada com sucesso!" });
       } catch (error) {
      console.error("Erro alterar senha:", error); 
            
      return NextResponse.json( { error: "Erro interno" }, { status: 500 } );
          
 } }