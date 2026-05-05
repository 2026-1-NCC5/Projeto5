import { http, HttpResponse } from 'msw';
import { mockItemsBase } from '../list/item';

export const itemHandlers = [
  http.get('*/itens', () => {
    // Retorna o objeto base com todas as labels e suas variantes
    return HttpResponse.json(mockItemsBase);
  }),

  // Rota extra opcional para pegar uma lista única de todas as variantes de todos os produtos
  http.get('*/itens/catalogo', () => {
    const allVariants = Object.values(mockItemsBase).flatMap(item => item.variants);
    return HttpResponse.json(allVariants);
  }),
];
