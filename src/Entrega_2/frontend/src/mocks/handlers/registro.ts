import { http, HttpResponse } from 'msw';
import { mockRegistros } from '../data';
import { sanitizeForJSON } from '../utils';

export const registroHandlers = [
  http.get('*/:username/:slugProjeto/:slugEdicao/registros/me', ({ params }) => {
    const { username, slugProjeto, slugEdicao } = params;
     const filtered = mockRegistros.filter(r => 
      r.aluno.turma.edicao.slug === slugEdicao && 
      r.aluno.turma.edicao.projeto.slug === slugProjeto
    );
    return HttpResponse.json(sanitizeForJSON(filtered));
  }),

  http.post('*/:username/:slugProjeto/:slugEdicao/registros', async ({ request }) => {
    const data = await request.json() as any;

    console.log('MSW: Recebendo novo registro:', data);

    const registroId = Math.floor(Math.random() * 100000);
    return HttpResponse.json({
      success: true,
      id: registroId,
      message: 'Registro processado com sucesso'
    }, { status: 201 });
  }),
];
