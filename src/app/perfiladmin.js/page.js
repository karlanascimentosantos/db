import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PerfilAdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/novoLogin");

    return (
        <div>
            <h1>Página e perfil de admin</h1>
            <p>Nome: {session.user.name}</p>
            <p>E-mail: {session.user.email}</p>
            <p>Papel: {session.user.role}</p>
        </div>
    );
}