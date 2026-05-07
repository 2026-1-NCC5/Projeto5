import { Aluno } from '@/types';
import { turmasMock } from './turma';

export const mockAlunos: Aluno[] = [
  {
    id: 1,
    nome: 'Alice Oliveira',
    ra: '2201456',
    email: 'alice.oliveira@fecap.br',
    turma: turmasMock[0],
    vinculo: { nome: 'Alice', email: 'alice.oliveira@fecap.br', avatar: '', preferences: { theme: 'dark' } },
    grupoNome: 'Alpha'
  },
  {
    id: 2,
    nome: 'Bruno Silva',
    ra: '2201987',
    email: 'bruno.silva@fecap.br',
    turma: turmasMock[0],
    vinculo: null,
    grupoNome: 'Beta'
  },
  {
    id: 3,
    nome: 'Carla Souza',
    ra: '2201332',
    email: 'carla.souza@fecap.br',
    turma: turmasMock[0],
    vinculo: { nome: 'Carla', email: 'carla.souza@fecap.br', avatar: '', preferences: { theme: 'dark' } },
    grupoNome: 'Alpha'
  },
  {
    id: 4,
    nome: 'Daniel Santos',
    ra: '2201110',
    email: 'daniel.santos@fecap.br',
    turma: turmasMock[1],
    vinculo: null,
    grupoNome: 'Gamma'
  },
  {
    id: 5,
    nome: 'Elena Ribeiro',
    ra: '2201555',
    email: 'elena.ribeiro@fecap.br',
    turma: turmasMock[0],
    vinculo: null,
    grupoNome: 'Beta'
  }
];
