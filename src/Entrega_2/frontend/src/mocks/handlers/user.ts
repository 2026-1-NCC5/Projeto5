import { http, HttpResponse } from 'msw';
import { usersMock } from '../list/user';

export const userHandlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    const user = usersMock.find(u => u.email === email && u.password === password);

    if (user) {
      // Retornamos o ID no corpo para o frontend salvar no cookie de forma confiável
      return HttpResponse.json(
        { 
          access_token: user.token,
          userId: user.id 
        },
        { 
          headers: {
            'Set-Cookie': `user_id=${user.id}; Path=/;`,
          }
        }
      );
    }

    return new HttpResponse('Credenciais inválidas', { status: 401 });
  }),

  http.get('*/api/auth/me', ({ request }) => {
    const cookies = request.headers.get('cookie') || '';
    const userIdMatch = cookies.match(/user_id=([^;]+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    const user = usersMock.find(u => String(u.id) === String(userId));

    if (user) {
      return HttpResponse.json(user);
    }

    return new HttpResponse('Não autorizado', { status: 401 });
  }),
];