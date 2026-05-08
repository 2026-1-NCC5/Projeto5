import { http, HttpResponse } from 'msw';
import { mockGrupos } from '../list/grupo';
import { Grupo } from '@/types';

export const grupoHandlers = [
  // GET /grupos
  http.get('*/api/grupos', () => {
    return HttpResponse.json(mockGrupos);
  }),

  // POST /grupos
  http.post('*/api/grupos', async ({ request }) => {
    const newGrupo = (await request.json()) as Grupo;
    const id = Date.now().toString();
    const grupoWithId = { ...newGrupo, id, alunos: [], coletas: [], pesoTotal: 0, precoTotal: 0 };
    mockGrupos.push(grupoWithId);
    return HttpResponse.json(grupoWithId, { status: 201 });
  }),

  // PUT /grupos/:id
  http.put('*/api/grupos/:id', async ({ request, params }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Grupo>;
    const index = mockGrupos.findIndex((g) => g.id?.toString() === id);

    if (index !== -1) {
      mockGrupos[index] = { ...mockGrupos[index], ...updates };
      return HttpResponse.json(mockGrupos[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE /grupos/:id
  http.delete('*/api/grupos/:id', ({ params }) => {
    const { id } = params;
    const index = mockGrupos.findIndex((g) => g.id?.toString() === id);

    if (index !== -1) {
      mockGrupos.splice(index, 1);
      return new HttpResponse(null, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
