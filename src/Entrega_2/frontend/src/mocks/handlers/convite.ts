import { http, HttpResponse } from 'msw';
import { convitesMock, mockAlunos, mockGrupos, usersMock } from '../data';
import { Convite, ConviteStatus } from '@/types';

export const conviteHandlers = [
  // Listar convites pendentes do usuário logado
  http.get('/api/convites/pendentes', ({ request }) => {
    const cookies = request.headers.get('cookie') || '';
    const userId = cookies.match(/user_id=([^;]+)/)?.[1] || '1';

    console.log('[MSW] Buscando convites para:', userId);
    const pendentes = convitesMock.filter(c => 
      String(c.idConvidado) === String(userId) && c.status === 'pendente'
    );

    return HttpResponse.json(pendentes);
  }),

  // Responder a um convite (aceitar/recusar)
  http.put('/api/convites/:id', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json() as { status: ConviteStatus };
    console.log('[MSW] PUT Convite:', id, status);

    const index = convitesMock.findIndex(c => String(c.id) === String(id));
    if (index === -1) return new HttpResponse(null, { status: 404 });

    convitesMock[index].status = status;

    if (status === 'aceito') {
      const convite = convitesMock[index];
      // Lógica simplificada: vincula o aluno ao grupo no mock
      const aluno = mockAlunos.find(a => String(a.vinculo?.id) === String(convite.idConvidado));
      const grupo = mockGrupos.find(g => g.nome === convite.nomeGrupo);
      
      if (aluno && grupo) {
        aluno.grupo = grupo;
        if (!grupo.alunos.find(a => a.id === aluno.id)) {
            grupo.alunos.push(aluno);
        }
      }
    }

    return HttpResponse.json(convitesMock[index]);
  }),

  // Criar um novo convite
  http.post('/api/convites', async ({ request }) => {
    const body = await request.json() as any;
    const novoConvite: Convite = {
      id: Math.floor(Math.random() * 10000),
      idCriador: body.idCriador, // No mock aceitamos ID aqui para simplificar
      idConvidado: body.idConvidado,
      nomeCriador: body.nomeCriador || 'Usuário',
      nomeGrupo: body.nomeGrupo!,
      status: 'pendente',
      dataCriacao: new Date().toISOString()
    };

    convitesMock.push(novoConvite);
    return HttpResponse.json(novoConvite, { status: 201 });
  }),

  // Deletar um convite (ao recusar)
  http.delete('/api/convites/:id', ({ params }) => {
    const { id } = params;
    console.log('[MSW] DELETE Convite:', id);
    const index = convitesMock.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      convitesMock.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Listar alunos sem grupo (para convidar)
  http.get('*/api/alunos/sem-grupo', ({ request }) => {
    const url = new URL(request.url);
    const turmaSlug = url.searchParams.get('turma');

    const semGrupo = mockAlunos.filter(a => 
      (!a.grupo) && (!turmaSlug || a.turma.slug === turmaSlug)
    );

    return HttpResponse.json(semGrupo);
  })
];
