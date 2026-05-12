import { http, HttpResponse } from 'msw';
import { usersMock } from '../data';

export const userHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const formData = await request.formData();
      const usernameOrEmail = formData.get('username') as string;
      const password = formData.get('password') as string;
      const user = usersMock.find(u => (u.email === usernameOrEmail || u.username === usernameOrEmail) && u.password === password);

      if (user) {
        return HttpResponse.json({ 
          access_token: user.token,
          token_type: 'bearer',
          user: user
        }, { 
          headers: { 'Set-Cookie': `user_id=${user.id}; Path=/;` }
        });
      }

      return new HttpResponse(JSON.stringify({ detail: 'Credenciais inválidas' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('MSW: Erro no handler de login:', err);
      return new HttpResponse(JSON.stringify({ detail: 'Erro interno no mock' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),

  http.get('/api/usuarios/me', ({ request }) => {
    const cookies = request.headers.get('cookie') || '';
    const userIdMatch = cookies.match(/user_id=([^;]+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;
    const user = usersMock.find(u => String(u.id) === String(userId)) || usersMock[0];
    return HttpResponse.json(user);
  }),

  http.put('/api/usuarios/me', async ({ request }) => {
    const cookies = request.headers.get('cookie') || '';
    const userIdMatch = cookies.match(/user_id=([^;]+)/);
    const userId = userIdMatch ? userIdMatch[1] : '1';
    const dados = await request.json() as any;

    const index = usersMock.findIndex(u => String(u.id) === String(userId));
    if (index !== -1) {
      usersMock[index] = { ...usersMock[index], ...dados };
      return HttpResponse.json(usersMock[index]);
    }
    return new HttpResponse('Usuário não encontrado', { status: 404 });
  }),
];