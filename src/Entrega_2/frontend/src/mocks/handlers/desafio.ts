import { http, HttpResponse } from 'msw';
import { Desafio } from '@/types';
import { desafiosMock } from '../list/desafio';

export const desafioHandlers = [
  http.get('*/projetos/:slug/desafios', ({ params }) => {
    const { slug } = params;
    
    // Filtra os desafios do projeto específico
    const desafiosDoProjeto = desafiosMock.filter(d => d.projetoSlug === slug);

    // Adiciona a lógica de status dinâmico
    const desafiosComStatus = desafiosDoProjeto.map(desafio => {
      const hoje = new Date();
      const inicio = new Date(desafio.dataInicio);
      const fim = new Date(desafio.dataFim);

      // Está ativo se: hoje >= inicio E hoje <= fim
      const estaAtivo = hoje >= inicio && hoje <= fim;

      return {
        ...desafio,
        status: estaAtivo ? 'Ativo' : 'Inativo'
      };
    });

    return HttpResponse.json(desafiosComStatus);
  }),

  http.post('*/projetos/:slugProjeto/desafios', async ({ request, params }) => {
    const { slugProjeto } = params;
    const novoDesafio = await request.json() as any;

    // Adiciona metadados que normalmente o backend geraria
    const desafioCompleto = {
      id: Math.floor(Math.random() * 10000), // Gera um ID aleatório
      ...novoDesafio,
      projetoSlug: slugProjeto, // Garante o vínculo com o projeto da URL
    };

    // "Salva" no nosso array temporário
    desafiosMock.push(desafioCompleto);

    console.log('MSW: Novo desafio criado com sucesso:', desafioCompleto);

    return HttpResponse.json(desafioCompleto, { status: 201 });
  }),

  // Update desafio info
  http.put('*/api/projetos/:slugProjeto/desafios/:slugDesafio', async ({ request, params }) => {
    const { slugDesafio } = params;
    const dados = await request.json() as Partial<Desafio>;

    const index = desafiosMock.findIndex(d => d.slug === slugDesafio);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    desafiosMock[index] = {
      ...desafiosMock[index],
      ...dados,
      slug: dados.nome ? dados.nome.toLowerCase().replace(/\s+/g, '-') : desafiosMock[index].slug
    };

    console.log(`MSW: Desafio ${slugDesafio} atualizado:`, desafiosMock[index]);
    return HttpResponse.json(desafiosMock[index]);
  }),
];