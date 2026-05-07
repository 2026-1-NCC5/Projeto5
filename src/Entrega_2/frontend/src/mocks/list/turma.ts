import { Turma } from '../../types';
import { desafiosMock } from './desafio';  

export const turmasMock: Turma[] = [
  { id: 1, nome: 'Algoritmos I', quantidade: 32, slug: 'algoritmos-1', desafio: desafiosMock[1] },
  { id: 2, nome: 'Cálculo Aplicado', quantidade: 28, slug: 'calculo-aplicado', desafio: desafiosMock[1] },
  { id: 3, nome: 'IA & Machine Learning', quantidade: 15, slug: 'ia-machine-learning', desafio: desafiosMock[1] },
];
