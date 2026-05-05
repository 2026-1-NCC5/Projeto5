export type ProjetoPapel = 'adm' | 'membro';
export type ProjetoTipo = 'Comercial' | 'Departamento de Empresa' | 'Projeto Social' | 'Projeto Social Estudantil';

export interface Projeto {
  id: number | string;
  nome: string;
  slug: string;          
  imagem: string;
  dataCriacao: string;
  ativo: boolean;
  papel: ProjetoPapel;    
  tipo: ProjetoTipo;    
}

export interface UserPreferences {
  theme: 'light' | 'dark';
}

export interface User {
  nome: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
}

export interface Desafio {
  id: string | number;
  nome: string;
  slug: string;
  dataInicio: string;
  dataFim: string;
  projetoSlug: string;
  status?: 'ATIVO' | 'INATIVO' | 'PLANEJADO';
}

export interface Turma {
  id: string | number;
  nome: string;
  quantidade: number;
  slug: string;
}

export interface Aluno {
  id?: string | number;
  nome: string;
  email: string;
  ra: string;
  turma: Turma;
}

export interface ColetaItem {
  id: string;
  nome: string;
  labelNome: string;
  preco: number;
  peso: number;
  grau_de_confianca: number;
}

export interface Item {
  id: string;
  nome: string;
  peso: number;
  preco: number;
  comprimento: number;
  largura: number;
}
