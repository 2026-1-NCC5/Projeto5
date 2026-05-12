import { http, HttpResponse } from 'msw';
import { mockItemsBase } from '../data';

export const itemHandlers = [
  // GET items (Multi-tenant Real)
  http.get('*/:username/:slugProjeto/:slugEdicao/items', () => {
    return HttpResponse.json(mockItemsBase);
  }),

  // GET catalogo (Multi-tenant Real)
  http.get('*/:username/:slugProjeto/:slugEdicao/items/catalogo', () => {
    const allVariants = Object.values(mockItemsBase).flatMap(item => item.variants);
    return HttpResponse.json(allVariants);
  }),

  // POST: Adicionar novo item (Multi-tenant Real)
  http.post('*/:username/:slugProjeto/:slugEdicao/items', async ({ request }) => {
    const newItem = await request.json() as any;
    const itemWithId = { ...newItem, id: Date.now() };
    console.log('MSW: Item criado hierarquicamente:', itemWithId);
    return HttpResponse.json(itemWithId, { status: 201 });
  }),
];

