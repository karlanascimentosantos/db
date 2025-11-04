import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const precisaAuth =
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/usuario") ||
        pathname.startsWith("/historico") ||
        pathname.startsWith("/clientes");

    if (precisaAuth && !token) {
        const url = new URL("/novoLogin", req.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin")) {
        if (!token) return NextResponse.redirect(new URL("/novoLogin", req.url));
        if (token.role !== "admin")
            return NextResponse.redirect(new URL("/nao-autorizado", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/perfil/:path*",
        "/usuario/:path*",
        "/historico/:path*",
        "/clientes/:path*",
        "/admin/:path*",
    ],
};