import { Item, Coleta, CheckoutSession, CheckoutItemSynthesis } from '@/types';
import { usersMock } from './auth';
import { edicoesMock } from './core';
import { mockAlunos, mockGrupos } from './academic';

// 5. ITENS
export const itemsArray: Item[] = [
  { id: '1', nome: 'Arroz 1kg', peso: 1.0, preco: 5.50, comprimento: 21, largura: 15 },
  { id: '2', nome: 'Arroz 5kg', peso: 5.0, preco: 28.90, comprimento: 35, largura: 24 },
  { id: '3', nome: 'Feijão 1kg', peso: 1.0, preco: 8.50, comprimento: 19, largura: 13 },
  { id: '4', nome: 'Macarrão 500g', peso: 0.5, preco: 4.20, comprimento: 26, largura: 8 },
  { id: '5', nome: 'Fubá 500g', peso: 0.5, preco: 3.50, comprimento: 18, largura: 12 },
  { id: '6', nome: 'Açúcar 1kg', peso: 1.0, preco: 4.80, comprimento: 20, largura: 14 },
];

export const mockItemsBase: Record<string, { labelNome: string, variants: Item[] }> = {
  'pacote_de_arroz': { labelNome: 'pacote_de_arroz', variants: [itemsArray[0], itemsArray[1]] },
  'pacote_de_feijao': { labelNome: 'pacote_de_feijao', variants: [itemsArray[2]] },
  'pacote_de_macarrão': { labelNome: 'pacote_de_macarrão', variants: [itemsArray[3]] },
  'pacote_de_fuba': { labelNome: 'pacote_de_fuba', variants: [itemsArray[4]] },
  'pacote_de_acucar': { labelNome: 'pacote_de_acucar', variants: [itemsArray[5]] },
};

// 8. COLETAS
export const mockColetas: Coleta[] = [
  {
    id: 'col-1',
    dataHora: '2026-05-01T10:30:00Z',
    itens: [itemsArray[0], itemsArray[2], itemsArray[2]],
    pesoTotal: 3.0,
    precoTotal: 22.50,
    grupo: mockGrupos[0],
    aluno: mockAlunos[0],
  },
  {
    id: 'col-2',
    dataHora: '2026-05-03T14:45:00Z',
    itens: [itemsArray[3], itemsArray[3]],
    pesoTotal: 1.0,
    precoTotal: 8.40,
    grupo: mockGrupos[0],
    aluno: mockAlunos[2],
  },
  {
    id: 'col-3',
    dataHora: '2026-05-02T09:15:00Z',
    itens: [itemsArray[0], itemsArray[0], itemsArray[2]],
    pesoTotal: 3.0,
    precoTotal: 19.50,
    grupo: mockGrupos[1],
    aluno: mockAlunos[1],
  }
];

// 11. REGISTROS (Histórico)
export const mockRegistros = [
  {
    id: 1,
    data: '2026-05-01T10:00:00Z',
    tipo: 'itens',
    aluno: mockAlunos[0],
    grupo: mockGrupos[0],
    detalhes: [
      { nome: 'Arroz 5kg', qtd: 2, peso: 10.0, valor: 57.80 },
      { nome: 'Feijão 1kg', qtd: 3, peso: 3.0, valor: 25.50 }
    ],
    totalPeso: 13.0,
    totalValor: 83.30
  },
  {
    id: 2,
    data: '2026-05-03T14:30:00Z',
    tipo: 'dinheiro',
    aluno: mockAlunos[2],
    grupo: mockGrupos[0],
    totalPeso: 0,
    totalValor: 50.00,
    detalhes: []
  },
  {
    id: 3,
    data: '2026-05-05T09:15:00Z',
    tipo: 'resgate',
    aluno: mockAlunos[0],
    grupo: mockGrupos[0],
    totalPeso: 0,
    totalValor: -20.00, 
    detalhes: []
  }
];

// 12. CHECKOUT
export const mockCheckoutHistory: CheckoutSession[] = [
  { id: 'SES-001', data: '2026-05-01T10:30:00Z', totalItens: 45, responsavel: usersMock[0], edicao: edicoesMock[0] },
  { id: 'SES-002', data: '2026-05-02T14:15:00Z', totalItens: 32, responsavel: usersMock[0], edicao: edicoesMock[0] },
  { id: 'SES-003', data: '2026-05-05T09:00:00Z', totalItens: 88, responsavel: usersMock[0], edicao: edicoesMock[0] },
];

export const mockCheckoutSynthesis: CheckoutItemSynthesis[] = [
  { itemNome: 'Arroz 1kg', metaAlunos: 150, realizadoEdicao: 120 },
  { itemNome: 'Arroz 5kg', metaAlunos: 40, realizadoEdicao: 35 },
  { itemNome: 'Feijão 1kg', metaAlunos: 200, realizadoEdicao: 185 },
  { itemNome: 'Macarrão 500g', metaAlunos: 100, realizadoEdicao: 95 },
  { itemNome: 'Fubá 500g', metaAlunos: 80, realizadoEdicao: 60 },
  { itemNome: 'Açúcar 1kg', metaAlunos: 120, realizadoEdicao: 110 },
];
