import { Grupo, Coleta, Aluno } from '@/types';
import { mockAlunos } from './aluno';
import { turmasMock } from './turma';
import { mockItemsBase } from './item';

// Helper to get variants
const itemsArray = [
  mockItemsBase['pacote_de_arroz'].variants[0],
  mockItemsBase['pacote_de_feijao'].variants[0],
  mockItemsBase['pacote_de_macarrão'].variants[0],
];

// Helper to calculate totals for a Coleta
const calculateColetaTotals = (itens: typeof itemsArray) => {
  return itens.reduce(
    (acc, item) => ({
      pesoTotal: acc.pesoTotal + item.peso,
      precoTotal: acc.precoTotal + item.preco,
    }),
    { pesoTotal: 0, precoTotal: 0 }
  );
};

// Coleta 1
const coleta1Itens = [itemsArray[0], itemsArray[1], itemsArray[1]]; // 1 Arroz, 2 Feijão
const coleta1Totals = calculateColetaTotals(coleta1Itens);
const coleta1: Omit<Coleta, 'grupo'> & { grupo?: any } = {
  id: 'col-1',
  dataHora: '2026-05-01T10:30:00Z',
  itens: coleta1Itens,
  pesoTotal: coleta1Totals.pesoTotal,
  precoTotal: coleta1Totals.precoTotal,
  aluno: mockAlunos[0],
};

// Coleta 2
const coleta2Itens = [itemsArray[2], itemsArray[2]]; // 2 Macarrão
const coleta2Totals = calculateColetaTotals(coleta2Itens);
const coleta2: Omit<Coleta, 'grupo'> & { grupo?: any } = {
  id: 'col-2',
  dataHora: '2026-05-03T14:45:00Z',
  itens: coleta2Itens,
  pesoTotal: coleta2Totals.pesoTotal,
  precoTotal: coleta2Totals.precoTotal,
  aluno: mockAlunos[2],
};

// Coleta 3
const coleta3Itens = [itemsArray[0], itemsArray[0], itemsArray[1]]; // 2 Arroz, 1 Feijão
const coleta3Totals = calculateColetaTotals(coleta3Itens);
const coleta3: Omit<Coleta, 'grupo'> & { grupo?: any } = {
  id: 'col-3',
  dataHora: '2026-05-02T09:15:00Z',
  itens: coleta3Itens,
  pesoTotal: coleta3Totals.pesoTotal,
  precoTotal: coleta3Totals.precoTotal,
  aluno: mockAlunos[1],
};

export let mockGrupos: Grupo[] = [
  {
    id: 1,
    nome: 'Alpha',
    alunos: mockAlunos.filter(a => a.grupoNome === 'Alpha'),
    coletas: [coleta1 as Coleta, coleta2 as Coleta],
    pesoTotal: coleta1Totals.pesoTotal + coleta2Totals.pesoTotal,
    precoTotal: coleta1Totals.precoTotal + coleta2Totals.precoTotal,
    turma: turmasMock[0],
  },
  {
    id: 2,
    nome: 'Beta',
    alunos: mockAlunos.filter(a => a.grupoNome === 'Beta'),
    coletas: [coleta3 as Coleta],
    pesoTotal: coleta3Totals.pesoTotal,
    precoTotal: coleta3Totals.precoTotal,
    turma: turmasMock[0],
  },
  {
    id: 3,
    nome: 'Gamma',
    alunos: mockAlunos.filter(a => a.grupoNome === 'Gamma'),
    coletas: [],
    pesoTotal: 0,
    precoTotal: 0,
    turma: turmasMock[1],
  }
];

// Resolving circular dependency manually for TS without breaking JSON
mockGrupos.forEach(grupo => {
  grupo.coletas.forEach(coleta => {
    // Only assigning primitive identifying data to avoid circular JSON stringify issues in MSW
    coleta.grupo = { id: grupo.id, nome: grupo.nome } as any;
  });
});
