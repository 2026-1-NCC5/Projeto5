import { CheckoutSession, CheckoutItemSynthesis } from '../../types';

export const mockCheckoutHistory: CheckoutSession[] = [
  { id: 'SES-001', data: '2026-05-01T10:30:00Z', totalItens: 45, responsavel: 'Admin Principal' },
  { id: 'SES-002', data: '2026-05-02T14:15:00Z', totalItens: 32, responsavel: 'Supervisor Alpha' },
  { id: 'SES-003', data: '2026-05-05T09:00:00Z', totalItens: 88, responsavel: 'Admin Principal' },
];

export const mockCheckoutSynthesis: CheckoutItemSynthesis[] = [
  { itemNome: 'Arroz 1kg', metaAlunos: 150, realizadoEdicao: 120 },
  { itemNome: 'Arroz 5kg', metaAlunos: 40, realizadoEdicao: 35 },
  { itemNome: 'Feijão 1kg', metaAlunos: 200, realizadoEdicao: 185 },
  { itemNome: 'Macarrão 500g', metaAlunos: 100, realizadoEdicao: 95 },
  { itemNome: 'Fubá 500g', metaAlunos: 80, realizadoEdicao: 60 },
  { itemNome: 'Açúcar 1kg', metaAlunos: 120, realizadoEdicao: 110 },
];
