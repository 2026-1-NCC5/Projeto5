import { Desafio } from '../../types';
import { projetosMock } from './projeto';

export const desafiosMock: Desafio[] = [
  {
    id: 2,
    nome: "2026.1",
    slug: "2026-1",
    dataInicio: "2026-05-01",
    dataFim: "2026-08-30",
    projetoSlug: "liderancas-empaticas",
    ativo: true,
    projeto: projetosMock[0]
  },
  {
    id: 3,
    nome: "2026.1",
    slug: "2026-1",
    dataInicio: "2026-05-01",
    dataFim: "2026-08-30",
    projetoSlug: "sustentabilidade-urbana",
    ativo: true,
    projeto: projetosMock[1]
  }
];
