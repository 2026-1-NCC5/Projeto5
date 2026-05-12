import { useState, useCallback } from 'react';
import { Item } from '@/types';
import { apiFetch } from '@/services/api';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca todos os itens do catálogo de uma edição específica
  const fetchCatalogo = useCallback(async (username: string, slugProjeto: string, slugEdicao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/catalogo`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar catálogo de itens');
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = async (username: string, slugProjeto: string, slugEdicao: string, dados: Partial<Item>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/catalogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao adicionar item ao catálogo');
      const novo = await res.json();
      setItems((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateItem = async (username: string, slugProjeto: string, slugEdicao: string, itemId: number, dados: Partial<Item>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/catalogo/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao atualizar item');
      const atualizado = await res.json();
      setItems((prev) => prev.map(item => Number(item.id) === Number(itemId) ? atualizado : item));
      return atualizado;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteItem = async (username: string, slugProjeto: string, slugEdicao: string, itemId: number) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/catalogo/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir item do catálogo');
      setItems((prev) => prev.filter(item => Number(item.id) !== Number(itemId)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    items,
    isLoading,
    error,
    fetchCatalogo,
    addItem,
    updateItem,
    deleteItem
  };
}
