// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Em ambiente de servidor, verificamos os Cookies (o localStorage só existe no navegador)
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Regra: Se estiver logado e tentar ir para /login ou /cadastro -> vai para /projetos
  if (token && (pathname === '/login' || pathname === '/cadastro')) {
    return NextResponse.redirect(new URL('/projetos', request.url));
  }

  // 2. Regra: Se NÃO estiver logado e tentar acessar o dashboard/projetos -> vai para /login
  const isDashboardRoute = pathname.startsWith('/projeto') || pathname === '/projetos' || pathname === '/perfil';
  
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configura quais caminhos o middleware deve observar
export const config = {
  matcher: ['/login', '/cadastro', '/projetos', '/projeto/:path*', '/perfil'],
};