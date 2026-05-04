import { http, HttpResponse } from 'msw';
import { Desafio } from '@/types';

const desafiosMock: Desafio[] = [
  {
    id: 1,
    nome: "2025.1",
    slug: "2025-1",
    dataInicio: "2025-01-01",
    dataFim: "2025-03-30",
    projetoSlug: "liderancas-empaticas"
  },
  {
    id: 2,
    nome: "2026.1",
    slug: "auditagem-inverno",
    dataInicio: "2026-05-01",
    dataFim: "2026-08-30",
    projetoSlug: "liderancas-empaticas"
  }
];

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
      projetoSlug: slugProjeto, // Garante o vínculo com o projeto da URL[cite: 7]
    };

    // "Salva" no nosso array temporário
    desafiosMock.push(desafioCompleto);

    console.log('MSW: Novo desafio criado com sucesso:', desafioCompleto);

    return HttpResponse.json(desafioCompleto, { status: 201 });
  }),
];