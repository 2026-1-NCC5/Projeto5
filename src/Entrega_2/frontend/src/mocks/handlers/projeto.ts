import { http, HttpResponse } from 'msw';
import { Projeto } from '@/types';
import { projetosMock } from '../list/projeto';

// Banco de dados em memória para projetos (iniciado com o mock)
let projetos: Projeto[] = [...projetosMock];

export const projetoHandlers = [
  http.get('*/projetos/', () => HttpResponse.json(projetos)),
  
  http.post('*/projetos/', async ({ request }) => {
    const novo = await request.json() as Projeto;
    projetos.push(novo);
    return HttpResponse.json(novo, { status: 201 });
  }),

// src/mocks/handlers/projeto.ts

http.post('*/projetos/', async ({ request }) => {
  const dados = await request.json() as any;

  const novoProjeto: Projeto = {
    // Garante um ID único usando o timestamp para evitar o erro de 'key'
    id: Date.now(), 
    nome: dados.nome,
    slug: dados.slug,
    tipo: dados.tipo,
    // Garante que o papel nunca seja undefined para não quebrar o toUpperCase()
    papel: 'adm', 
    ativo: true,
    dataCriacao: new Date().toLocaleDateString('pt-BR'),
    imagem: `https://picsum.photos/seed/${dados.slug}/600/400`
  };

  projetos.push(novoProjeto);
  return HttpResponse.json(novoProjeto, { status: 201 });
    })
];