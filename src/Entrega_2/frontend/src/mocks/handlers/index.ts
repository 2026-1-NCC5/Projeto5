import { projetoHandlers } from './projeto';
import { userHandlers } from './user';
import { desafioHandlers } from './desafio';
import { turmaHandlers } from './turma';
import { itemHandlers } from './item';

export const handlers = [
  ...projetoHandlers,
  ...userHandlers,
  ...desafioHandlers,
  ...turmaHandlers,
  ...itemHandlers
];