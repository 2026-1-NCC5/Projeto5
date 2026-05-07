import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas que não exigem autenticação
  const publicRoutes = ['/login', '/cadastro', '/home'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 1. Regra: Se estiver logado e tentar ir para /login ou /cadastro -> vai para /projetos (ou callbackUrl)
  if (token && (pathname === '/login' || pathname === '/cadastro')) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/projetos';
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // 2. Regra: Se NÃO estiver logado e a rota NÃO for pública -> vai para /login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configura quais caminhos o middleware deve observar
export const config = {
  // Ignoramos API, arquivos estáticos do Next, imagens, favicon e o Mock Service Worker
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)'],
};
