import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";


async function findUserByEmail(email) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM consumidor WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}


async function createGoogleUser({ nome, email }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO consumidor (nome, email, senha_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, email, null, "cliente"]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}


export const authOptions = {
  providers: [
  
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.senha) return null;

        const user = await findUserByEmail(credentials.email);
        if (!user) return null;

        const senhaValida = await bcrypt.compare(
          credentials.senha,
          user.senha_hash
        );
        if (!senhaValida) return null;

        return {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        let dbUser = await findUserByEmail(user.email);

        if (!dbUser) {
          dbUser = await createGoogleUser({
            nome: user.name,
            email: user.email,
          });
        }

        user.id = dbUser.id;
        user.nome = dbUser.nome;
        user.role = dbUser.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.nome = token.nome;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

