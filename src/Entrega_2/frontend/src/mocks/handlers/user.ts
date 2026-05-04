import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    // Lógica de validação de login
    return HttpResponse.json({ access_token: 'mock-token-123' });
  }),
];