import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

async function findUserByEmail(email) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM consumidor WHERE email = $1", [email]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials.email || !credentials.senha) return null;

          const user = await findUserByEmail(credentials.email);
          if (!user) return null;

          const senhaValida = await bcrypt.compare(credentials.senha, user.senha_hash);
          if (!senhaValida) return null;

          return {
            id: user.id,
            nome: user.nome,
            email: user.email,
          };
        } catch (err) {
          console.error("Erro no authorize:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.nome = token.nome;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
