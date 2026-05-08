import { http, HttpResponse } from 'msw';
import { mockItemsBase } from '../list/item';

export const itemHandlers = [
  http.get('*/api/itens', () => {
    // Retorna o objeto base com todas as labels e suas variantes
    return HttpResponse.json(mockItemsBase);
  }),

  // Rota extra opcional para pegar uma lista única de todas as variantes de todos os produtos
  http.get('*/api/itens/catalogo', () => {
    const allVariants = Object.values(mockItemsBase).flatMap(item => item.variants);
    return HttpResponse.json(allVariants);
  }),

  http.post('*/api/itens', async ({ request }) => {
    const newItem = await request.json() as any;
    const itemWithId = {
      ...newItem,
      id: Date.now().toString()
    };
    
    // Simplificadamente, apenas logamos e retornamos, 
    // já que o mockItemsBase é complexo e não queremos quebrar a estrutura de engine de IA
    console.log('MSW: Novo item criado:', itemWithId);
    
    return HttpResponse.json(itemWithId, { status: 201 });
  }),
];
