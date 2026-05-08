import { projetoHandlers } from './projeto';
import { userHandlers } from './user';
import { desafioHandlers } from './desafio';
import { turmaHandlers } from './turma';
import { itemHandlers } from './item';
import { checkoutHandlers } from './checkout';
import { alunoHandlers } from './aluno';
import { grupoHandlers } from './grupo';
import { metricasHandlers } from './metricas';
import { registroHandlers } from './registro';

export const handlers = [
  ...projetoHandlers,
  ...userHandlers,
  ...desafioHandlers,
  ...turmaHandlers,
  ...itemHandlers,
  ...checkoutHandlers,
  ...alunoHandlers,
  ...grupoHandlers,
  ...metricasHandlers,
  ...registroHandlers
];