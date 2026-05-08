export type ProjetoPapel = 'adm' | 'membro';
export type ProjetoTipo = 'Comercial' | 'Departamento de Empresa' | 'Projeto Social' | 'Projeto Social Estudantil';

export interface User {
  id: string | number;
  nome: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
}

export interface Projeto {
  id: number | string;
  nome: string;
  slug: string;
  imagem: string;
  dataCriacao: string;
  papel: ProjetoPapel;
  tipo: ProjetoTipo;
  ativo: boolean;
  descricao?: string;
  admins?: string[];
}
  
export interface Desafio {
  id: string | number;
  nome: string;
  slug: string;
  projetoSlug: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  itensPermitidos?: string[];
  projeto?: Projeto;
}

export interface Turma {
  id: string | number;
  nome: string;
  quantidade: number;
  slug: string;
  desafio?: Desafio;
}

export interface Aluno {
  id?: string | number;
  nome: string;
  email: string;
  ra: string;
  turma: Turma;
  vinculo: User | null;
  grupoNome?: string;
}

export interface Grupo {
  id?: string | number;
  nome: string;
  alunos: Aluno[];
  coletas: Coleta[];
  pesoTotal: number;
  precoTotal: number;
  turma: Turma;
}

export interface Coleta {
  id: string;
  dataHora: string;
  itens: Item[];
  precoTotal: number;
  pesoTotal: number;
  grupo: Grupo;
  aluno: Aluno;
}

export interface Item {
  id: string;
  nome: string;
  peso: number;
  preco: number;
  comprimento: number;
  largura: number;
}

export interface MetricasDashboard {
  totalQuilos: number;
  totalDinheiro: number;
  totalAlunos: number;
  totalGrupos: number;
  totalTurmas: number;
  mediaQuilosPorAluno: number;
  mediaQuilosPorGrupo: number;
  mediaQuilosPorTurma: number;
  pizzaItems: { nome: string; percentual: number }[];
  progressao: { data: string; itens: number; dinheiro: number }[];
  kilosPorItem: { nome: string; quilos: number }[];
  rankingGrupos: { posicao: number; nome: string; quilos: number; dinheiro: number }[];
  rankingTurmas: { posicao: number; nome: string; quilos: number; dinheiro: number }[];
}

export interface CheckoutSession {
  id: string | number;
  data: string;
  totalItens: number;
  responsavel: string;
}

export interface CheckoutItemSynthesis {
  itemNome: string;
  metaAlunos: number;
  realizadoEdicao: number;
}
