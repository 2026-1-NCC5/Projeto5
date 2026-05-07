import { MetricasDashboard } from '@/types';

export const mockMetricas: MetricasDashboard = {
  totalQuilos: 1250.5, // 1250kg -> 1.25t
  totalDinheiro: 4500.0,
  totalAlunos: 150,
  totalGrupos: 15,
  totalTurmas: 5,
  mediaQuilosPorAluno: 8.33,
  mediaQuilosPorGrupo: 83.36,
  mediaQuilosPorTurma: 250.1,
  pizzaItems: [
    { nome: 'Arroz', percentual: 40 },
    { nome: 'Feijão', percentual: 25 },
    { nome: 'Macarrão', percentual: 20 },
    { nome: 'Óleo', percentual: 10 },
    { nome: 'Outros', percentual: 5 },
  ],
  progressao: [
    { data: 'Semana 1', itens: 100, dinheiro: 500 },
    { data: 'Semana 2', itens: 300, dinheiro: 1200 },
    { data: 'Semana 3', itens: 700, dinheiro: 2500 },
    { data: 'Semana 4', itens: 1250, dinheiro: 4500 },
  ],
  kilosPorItem: [
    { nome: 'Arroz', quilos: 500.2 },
    { nome: 'Feijão', quilos: 312.6 },
    { nome: 'Macarrão', quilos: 250.1 },
    { nome: 'Óleo', quilos: 125.0 },
    { nome: 'Outros', quilos: 62.6 },
  ],
  rankingGrupos: [
    { posicao: 1, nome: 'Grupo Alfa', quilos: 450.5, dinheiro: 1200 },
    { posicao: 2, nome: 'Grupo Beta', quilos: 320.0, dinheiro: 900 },
    { posicao: 3, nome: 'Grupo Gama', quilos: 280.0, dinheiro: 800 },
    { posicao: 4, nome: 'Grupo Delta', quilos: 150.0, dinheiro: 600 },
    { posicao: 5, nome: 'Grupo Epsilon', quilos: 50.0, dinheiro: 1000 },
  ],
  rankingTurmas: [
    { posicao: 1, nome: 'Turma A', quilos: 600.5, dinheiro: 2000 },
    { posicao: 2, nome: 'Turma B', quilos: 400.0, dinheiro: 1500 },
    { posicao: 3, nome: 'Turma C', quilos: 250.0, dinheiro: 1000 },
  ]
};
