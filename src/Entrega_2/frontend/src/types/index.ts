// --- AUTH TYPES ---
export type ProjetoPapel = 'adm' | 'membro';
export type ProjetoTipo = 'Comercial' | 'Departamento de Empresa' | 'Projeto Social' | 'Projeto Social Estudantil';

export interface UserPreferences {
  theme: 'light' | 'dark';
}

export interface User {
  id: number;
  nome: string;
  username: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
}

// --- CORE TYPES ---
export interface Projeto {
  id: number;
  nome: string;
  slug: string;
  imagem?: string;
  descricao?: string;
  status: string;
  tipo: ProjetoTipo;
  display: boolean;
  data_criacao: string;
  papel?: ProjetoPapel;
}

export interface Edicao {
  id: number;
  projeto_id: number;
  nome: string;
  slug: string;
  semestre?: string;
  data_inicio: string;
  data_fim: string;
  min_alunos_por_grupo: number;
  max_alunos_por_grupo: number;
  status: string;
  imagem?: string;
  projeto?: Projeto;
}

export interface Turma {
  id: number;
  edicao_id: number;
  nome: string;
  slug: string;
  qtd_alunos: number;
  grupos?: Grupo[];
}

// --- ACADEMIC TYPES ---
export interface Aluno {
  id: number;
  nome: string;
  email: string;
  ra: string;
  turma_id: number;
  usuario_id?: number | null;
  turma?: Turma;
  grupo?: Grupo;
  vinculo?: User | null;
}

export interface Grupo {
  id: number;
  nome: string;
  turma_id: number;
  alunos?: Aluno[];
  coletas?: Coleta[];
  peso_total?: number;
  valor_total?: number;
}

export type ConviteStatus = 'pendente' | 'aceito' | 'recusado';

export interface Convite {
  id: number;
  criador_id: number;
  convidado_id: number;
  grupo_id: number;
  nome_criador: string;
  nome_grupo: string;
  data_criacao: string;
  status: ConviteStatus;
  criador?: Aluno;
  convidado?: Aluno;
  grupo?: Grupo;
}

// --- INVENTORY TYPES ---
export interface Item {
  id: number;
  edicao_id?: number;
  nome: string;
  label?: string;
  preco: number;
  peso: number;
  largura?: number;
  comprimento?: number;
}

export interface RegistroItem {
  id: number;
  registro_id: number;
  item_id: number;
  data_hora: string;
  item?: Item;
}

export interface ColetaItem {
  id: number | string;
  nome: string;
  preco: number;
  peso: number;
  grau_de_confianca: number;
}

export interface Coleta {
  id: number;
  grupo_id: number;
  aluno_id: number;
  data_hora: string;
  peso_total: number;
  valor_total: number;
  itens?: Item[];
  aluno?: Aluno;
  grupo?: Grupo;
}

// --- ANALYTICS TYPES ---
export interface ResumoGeral {
  total_kg: number;
  total_dinheiro: number;
  total_alunos: number;
  total_grupos: number;
  total_turmas: number;
  media_kg_aluno: number;
  media_dinheiro_aluno: number;
  media_kg_grupo: number;
  media_dinheiro_grupo: number;
  media_kg_turma: number;
  media_dinheiro_turma: number;
}

export interface DistribuicaoItem {
  item_nome: string;
  quantidade_kg: number;
  porcentagem: number;
}

export interface EvolucaoDiaria {
  data: string;
  kg: number;
  dinheiro: number;
}

export interface RankingItem {
  posicao: number;
  nome: string;
  kg: number;
  valor: number;
}

export interface MetricasDashboard {
  resumo: ResumoGeral;
  distribuicao: DistribuicaoItem[];
  evolucao: EvolucaoDiaria[];
  ranking_grupos?: RankingItem[];
  ranking_turmas?: RankingItem[];
  turmas_disponiveis: { id: number; nome: string }[];
}
export interface CheckoutSession {
  id: number | string;
  data: string;
  total_itens: number;
  responsavel: User;
  edicao: Edicao;
}

export interface CheckoutItemSynthesis {
  item_nome: string;
  meta_alunos: number;
  realizado_edicao: number;
}
