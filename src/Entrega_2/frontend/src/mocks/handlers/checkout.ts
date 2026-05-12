import { http, HttpResponse } from 'msw';
import { mockCheckoutHistory, mockCheckoutSynthesis } from '../data';

export const checkoutHandlers = [
  // GET síntese da conferência (Multi-tenant Real)
  http.get('*/:slugProjeto/:slugEdicao/checkout/sintese', ({ params }) => {
    // No mock real, poderíamos filtrar a síntese se ela estivesse amarrada ao slugEdicao
    return HttpResponse.json(mockCheckoutSynthesis);
  }),

  // GET histórico de sessões (Multi-tenant Real)
  http.get('*/:slugProjeto/:slugEdicao/checkout/historico', ({ params }) => {
    const { slugProjeto, slugEdicao } = params;
    const filtered = mockCheckoutHistory.filter(s => 
      s.edicao.slug === slugEdicao && 
      s.edicao.projeto.slug === slugProjeto
    );
    return HttpResponse.json(filtered);
  }),

  // POST nova conferência
  http.post('*/:slugProjeto/:slugEdicao/checkout/verificacao', async ({ request }) => {
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
