import { http, HttpResponse } from 'msw';
import { mockRegistros } from '../list/registro';

export const registroHandlers = [
  http.get('*/api/registros/me', () => {
    // Retornamos os registros do grupo 'Alpha' por padrão para o bypass
    const groupHistory = mockRegistros.filter(r => r.grupoNome === 'Alpha');
    return HttpResponse.json(groupHistory);
  }),

  http.post('*/api/registros', async ({ request }) => {
    const data = await request.json() as any;

    console.log('MSW: Recebendo novo registro:', data);

    // Simulação de persistência lógica
    // No "banco" real seriam criadas entradas em:
    // 1. Tabela 'registro' (id, data, tipo, id_aluno)
    // 2. Tabela filha correspondente (registro_item, registro_valor ou registro_resgate)

    const registroId = Math.floor(Math.random() * 100000);

    // Simula resposta de sucesso
    return HttpResponse.json({
      success: true,
      id: registroId,
      message: 'Registro processado com sucesso'
    }, { status: 201 });
  }),
];
