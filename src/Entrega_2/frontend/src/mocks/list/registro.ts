export const mockRegistros = [
  {
    id: 1,
    data: '2026-05-01T10:00:00Z',
    tipo: 'itens',
    alunoNome: 'Alice Oliveira',
    grupoNome: 'Alpha',
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
    alunoNome: 'Carla Souza',
    grupoNome: 'Alpha',
    totalPeso: 0,
    totalValor: 50.00,
    detalhes: []
  },
  {
    id: 3,
    data: '2026-05-05T09:15:00Z',
    tipo: 'resgate',
    alunoNome: 'Alice Oliveira',
    grupoNome: 'Alpha',
    totalPeso: 0,
    totalValor: -20.00, // Resgate subtrai
    detalhes: []
  }
];
