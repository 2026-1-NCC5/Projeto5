import { Projeto } from '../../types';

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
    nome: "Projeto Z",
    slug: "projeto-z",
    imagem: 'https://picsum.photos/seed/business/600/400',
    dataCriacao: '10/04/2026',
    ativo: true,
    papel: 'membro',
    tipo: 'Comercial'
  },
  {
    id: 3,
    nome: "Projeto A",
    slug: "projeto-a",
    imagem: 'https://picsum.photos/seed/charity/600/400',
    dataCriacao: '15/03/2026',
    ativo: true,
    papel: 'adm',
    tipo: 'Projeto Social'
  }
];
