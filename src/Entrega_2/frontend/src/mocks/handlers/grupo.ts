import { http, HttpResponse } from 'msw';
import { mockGrupos } from '../data';
import { Grupo } from '@/types';
import { sanitizeForJSON } from '../utils';

export const grupoHandlers = [
  // Listagem ultra-filtrada (Multi-tenant Real)
  http.get('*/:username/:slugProjeto/:slugEdicao/:slugTurma/grupos', ({ params }) => {
    const { username, slugProjeto, slugEdicao, slugTurma } = params;
    const filtered = mockGrupos.filter(g => 
      g.turma.slug === slugTurma && 
      g.turma.edicao.slug === slugEdicao && 
      g.turma.edicao.projeto.slug === slugProjeto
    );
    return HttpResponse.json(sanitizeForJSON(filtered));
  }),

  // DELETE /grupos/:id
  http.delete('*/:username/:slugProjeto/:slugEdicao/:slugTurma/grupos/:id', ({ params }) => {
    const { id } = params;
    const index = mockGrupos.findIndex((g) => g.id?.toString() === id);

    if (index !== -1) {
      mockGrupos.splice(index, 1);
      return new HttpResponse(null, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
