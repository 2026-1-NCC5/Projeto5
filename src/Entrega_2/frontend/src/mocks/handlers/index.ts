import { projetoHandlers } from './projeto';
import { userHandlers } from './user';
import { edicaoHandlers } from './edicao';
import { turmaHandlers } from './turma';
import { itemHandlers } from './item';
import { checkoutHandlers } from './checkout';
import { alunoHandlers } from './aluno';
import { grupoHandlers } from './grupo';
import { metricasHandlers } from './metricas';
import { registroHandlers } from './registro';
import { conviteHandlers } from './convite';

export const handlers = [
  ...projetoHandlers,
  ...userHandlers,
  ...edicaoHandlers,
  ...turmaHandlers,
  ...itemHandlers,
  ...checkoutHandlers,
  ...alunoHandlers,
  ...grupoHandlers,
  ...metricasHandlers,
  ...registroHandlers,
  ...conviteHandlers
];