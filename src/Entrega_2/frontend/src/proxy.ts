import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lógica de proxy simplificada: Proteção de Autenticação e Redirecionamento Inicial
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userId = request.cookies.get('user_id')?.value;
  const username = request.cookies.get('username')?.value;
  const { pathname } = request.nextUrl;

  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next');
  const isAuthPage = pathname === '/login' || pathname === '/cadastro';
  const isApi = pathname.startsWith('/api');

  if (isPublicFile || isApi) {
    return NextResponse.next();
  }

  // 1. Proteção de Autenticação
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirecionamento de logado tentando acessar login/cadastro
  if (token && isAuthPage) {
    const target = username ? `/${username}/projetos` : '/';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Redirecionamento da Raiz (/) ou caminhos inválidos para o Dashboard do usuário
  if ((pathname === '/' || pathname === '/projetos') && token && username) {
    return NextResponse.redirect(new URL(`/${username}/projetos`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)'],
};
