import { projetoHandlers } from './projeto';
import { userHandlers } from './user';
import { desafioHandlers } from './desafio';

export const handlers = [
  ...projetoHandlers,
  ...userHandlers,
  ...desafioHandlers,
  // ...outros handlers que criar futuramente
];