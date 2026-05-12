import { Aluno, Grupo, Convite } from '@/types';
import { usersMock } from './auth';
import { turmasMock } from './core';

// 6. ALUNOS
export const mockAlunos: Aluno[] = [
  {
    id: 1,
    nome: 'Alice Oliveira',
    ra: '2201456',
    email: 'alice.oliveira@fecap.br',
    turma: turmasMock[0],
    vinculo: usersMock[1],
  },
  {
    id: 2,
    nome: 'Bruno Silva',
    ra: '2201987',
    email: 'bruno.silva@fecap.br',
    turma: turmasMock[0],
    vinculo: null,
  },
  {
    id: 3,
    nome: 'Carla Souza',
    ra: '2201332',
    email: 'carla.souza@fecap.br',
    turma: turmasMock[0],
    vinculo: null,
  },
  {
    id: 4,
    nome: 'Daniel Santos',
    ra: '2201110',
    email: 'daniel.santos@fecap.br',
    turma: turmasMock[1],
    vinculo: null,
  },
  {
    id: 5,
    nome: 'Elena Ribeiro',
    ra: '2201555',
    email: 'elena.ribeiro@fecap.br',
    turma: turmasMock[1],
    vinculo: null,
  }
];

// 7. GRUPOS
export const mockGrupos: Grupo[] = [
  {
    id: 1,
    nome: 'Alpha',
    alunos: [], 
    coletas: [],
    pesoTotal: 0,
    precoTotal: 0,
    turma: turmasMock[0],
  },
  {
    id: 2,
    nome: 'Beta',
    alunos: [],
    coletas: [],
    pesoTotal: 0,
    precoTotal: 0,
    turma: turmasMock[0],
  },
  {
    id: 3,
    nome: 'Gamma',
    alunos: [],
    coletas: [],
    pesoTotal: 0,
    precoTotal: 0,
    turma: turmasMock[1],
  }
];

// 8. CONVITES
export const convitesMock: Convite[] = [
  {
    id: 1,
    idCriador: mockAlunos[1],
    idConvidado: mockAlunos[0],
    nomeCriador: mockAlunos[1].nome,
    nomeGrupo: mockGrupos[0].nome,
    status: 'pendente',
    dataCriacao: '2026-05-09T10:00:00Z'
  }
];
