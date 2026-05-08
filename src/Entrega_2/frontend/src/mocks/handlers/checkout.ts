import { http, HttpResponse } from 'msw';
import { mockCheckoutHistory, mockCheckoutSynthesis } from '../list/checkout';

export const checkoutHandlers = [
  // GET síntese da conferência
  http.get('*/api/checkout/sintese', () => {
    return HttpResponse.json(mockCheckoutSynthesis);
  }),

  // GET histórico de sessões
  http.get('*/api/checkout/historico', () => {
    return HttpResponse.json(mockCheckoutHistory);
  }),

  // POST nova conferência
  http.post('*/api/checkout/verificacao', async ({ request }) => {
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
