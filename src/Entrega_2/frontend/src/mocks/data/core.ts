import { Projeto, Edicao, Turma } from '@/types';

export const projetosMock: Projeto[] = [
  {
    id: 1,
    nome: "Lideranças Empáticas",
    slug: "liderancas-empaticas",
    imagem: 'https://picsum.photos/seed/charity/600/400',
    dataCriacao: '15/03/2026',
    ativo: true,
    papel: 'adm',
    tipo: 'Projeto Social Estudantil'
  },
  {
    id: 2,
    nome: "Sustentabilidade Urbana",
    slug: "sustentabilidade-urbana",
    imagem: 'https://picsum.photos/seed/nature/600/400',
    dataCriacao: '10/04/2026',
    ativo: true,
    papel: 'membro',
    tipo: 'Projeto Social'
  },
];

export const edicoesMock: Edicao[] = [
  {
    id: 1,
    nome: "2026.1",
    slug: "2026-1",
    dataInicio: "2026-05-01",
    dataFim: "2026-08-30",
    ativo: true,
    projeto: projetosMock[0],
    capacidadeMinima: 2,
    capacidadeMaxima: 5,
  },
  {
    id: 2,
    nome: "2026.1",
    slug: "2026-1",
    dataInicio: "2026-05-01",
    dataFim: "2026-08-30",
    ativo: true,
    projeto: projetosMock[1],
    capacidadeMinima: 3,
    capacidadeMaxima: 6,
  }
];

export const desafiosMock = edicoesMock; // Alias para compatibilidade

export const turmasMock: Turma[] = [
  { id: 1, nome: 'Algoritmos I', quantidade: 32, slug: 'algoritmos-1', edicao: edicoesMock[0] },
  { id: 2, nome: 'Cálculo Aplicado', quantidade: 28, slug: 'calculo-aplicado', edicao: edicoesMock[0] },
  { id: 3, nome: 'IA & Machine Learning', quantidade: 15, slug: 'ia-machine-learning', edicao: edicoesMock[0] },
];
