import { http, HttpResponse } from 'msw';

export const checkoutHandlers = [
  http.post('*/checkout/verificacao', async ({ request }) => {
    const items = await request.json();
    
    console.log('Recebendo itens para conferência:', items);

    // Simula processamento
    return HttpResponse.json({
      message: 'Conferência finalizada com sucesso!',
      timestamp: new Date().toISOString(),
      totalItems: Array.isArray(items) ? items.length : 0
    }, { status: 201 });
  }),
];
