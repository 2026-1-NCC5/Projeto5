import { Item } from '../types';

export const mockItemsBase: Record<string, { labelNome: string, variants: Item[] }> = {
  'pacote_de_arroz': {
    labelNome: 'pacote_de_arroz',
    variants: [
      { id: '1', nome: 'Arroz 1kg', peso: 1.0, preco: 5.50, comprimento: 21, largura: 15 },
      { id: '2', nome: 'Arroz 5kg', peso: 5.0, preco: 28.90, comprimento: 35, largura: 24 },
    ]
  },
  'pacote_de_feijao': {
    labelNome: 'pacote_de_feijao',
    variants: [
      { id: '3', nome: 'Feijão 1kg', peso: 1.0, preco: 8.50, comprimento: 19, largura: 13 },
    ]
  },
  'pacote_de_macarrão': {
    labelNome: 'pacote_de_macarrão',
    variants: [
      { id: '4',nome: 'Macarrão 500g', peso: 0.5, preco: 4.20, comprimento: 26, largura: 8 },
    ]
  },
  'pacote_de_fuba': {
    labelNome: 'pacote_de_fuba',
    variants: [
      { id: '5', nome: 'Fubá 500g', peso: 0.5, preco: 3.50, comprimento: 18, largura: 12 },
    ]
  },
  'pacote_de_acucar': {
    labelNome: 'pacote_de_acucar',
    variants: [
      { id: '6', nome: 'Açúcar 1kg', peso: 1.0, preco: 4.80, comprimento: 20, largura: 14 },
    ]
  },
  'unknown': {
    labelNome: 'unknown',
    variants: [
      { id: '7', nome: 'Produto Desconhecido', peso: 0.0, preco: 0.0, comprimento: 0, largura: 0 },
    ]
  }
};
