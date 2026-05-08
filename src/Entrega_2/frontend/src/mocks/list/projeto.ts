import { Projeto } from '../../types';

export const projetosMock: Projeto[] = [
  {
    id: 1,
    nome: "Lideranças Empáticas",
    slug: "liderancas-empaticas",
    imagem: 'https://picsum.photos/seed/charity/600/400',
    dataCriacao: '15/03/2026',
    ativo: true,
    papel: 'adm', // Será sobrescrito pelo handler
    tipo: 'Projeto Social Estudantil'
  },
  {
    id: 2,
    nome: "Sustentabilidade Urbana",
    slug: "sustentabilidade-urbana",
    imagem: 'https://picsum.photos/seed/nature/600/400',
    dataCriacao: '10/04/2026',
    ativo: true,
    papel: 'membro', // Será sobrescrito pelo handler
    tipo: 'Projeto Social'
  },
  {
    id: 3,
    nome: "Projeto Teste ADM",
    slug: "teste-adm",
    imagem: 'https://picsum.photos/seed/adm/600/400',
    dataCriacao: '07/05/2026',
    ativo: true,
    papel: 'adm',
    tipo: 'Comercial'
  },
  {
    id: 4,
    nome: "Projeto Teste Membro",
    slug: "teste-membro",
    imagem: 'https://picsum.photos/seed/member/600/400',
    dataCriacao: '07/05/2026',
    ativo: true,
    papel: 'membro',
    tipo: 'Departamento de Empresa'
  }
];
