import { http, HttpResponse } from 'msw';
import { Edicao } from '@/types';
import { edicoesMock, projetosMock, usersMock } from '../data';

export const edicaoHandlers = [
  http.get('*/:username/:slug/edicoes', ({ params, request }) => {
    const { username, slug } = params;

    // Validação de Identidade
    const cookies = request.headers.get('cookie') || '';
    const userId = cookies.match(/user_id=([^;]+)/)?.[1] || '1';
    const loggedInUser = usersMock.find(u => String(u.id) === String(userId));
    if (loggedInUser && loggedInUser.username !== username) {
      return new HttpResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    
    // Filtra as edições do projeto específico
    const edicoesDoProjeto = edicoesMock.filter(e => e.projeto.slug === slug);

    // Adiciona a lógica de status dinâmico
    const edicoesComStatus = edicoesDoProjeto.map(edicao => {
      const hoje = new Date();
      const inicio = new Date(edicao.dataInicio);
      const fim = new Date(edicao.dataFim);

      // Está ativo se: hoje >= inicio E hoje <= fim
      const estaAtivo = hoje >= inicio && hoje <= fim;

      return {
        ...edicao,
        status: estaAtivo ? 'Ativo' : 'Inativo'
      };
    });

    return HttpResponse.json(edicoesComStatus);
  }),

  http.post('*/:username/:slugProjeto/edicoes', async ({ request, params }) => {
    const { username, slugProjeto } = params;
    const novaEdicaoData = await request.json() as any;
    
    const projeto = projetosMock.find(p => p.slug === slugProjeto);
    if (!projeto) return new HttpResponse(null, { status: 404 });

    const edicaoCompleta: Edicao = {
      id: Math.floor(Math.random() * 10000),
      ...novaEdicaoData,
      projeto,
    };

    edicoesMock.push(edicaoCompleta);
    console.log('MSW: Nova edição criada:', edicaoCompleta);

    return HttpResponse.json(edicaoCompleta, { status: 201 });
  }),

  // Update edicao info
  http.put('*/:username/:slugProjeto/edicoes/:slugEdicao', async ({ request, params }) => {
    const { username, slugEdicao } = params;
    const dados = await request.json() as Partial<Edicao>;

    const index = edicoesMock.findIndex(e => e.slug === slugEdicao);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    edicoesMock[index] = {
      ...edicoesMock[index],
      ...dados,
      slug: dados.nome ? dados.nome.toLowerCase().replace(/\s+/g, '-') : edicoesMock[index].slug
    };

    console.log(`MSW: Edição ${slugEdicao} atualizada:`, edicoesMock[index]);
    return HttpResponse.json(edicoesMock[index]);
  }),
];