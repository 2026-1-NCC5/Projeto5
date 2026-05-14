import { useState, useCallback } from 'react';
import { apiFetch } from '@/services/api';

export function useRegistros() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [resumo, setResumo] = useState({
    total_peso: 0,
    total_valor: 0,
    total_dinheiro: 0,
    resumo_itens: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca registros e traz a contabilidade total da edição (Filtros opcionais)
  const fetchRegistros = useCallback(async (username: string, slug_projeto: string, slug_edicao: string, filtros?: { aluno_id?: number, grupo_id?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filtros?.aluno_id) params.append('aluno_id', filtros.aluno_id.toString());
      if (filtros?.grupo_id) params.append('grupo_id', filtros.grupo_id.toString());
      
      const url = `${username}/${slug_projeto}/${slug_edicao}/registros/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await apiFetch(url);
      
      if (!res.ok) throw new Error('Falha ao carregar registros');
      const data = await res.json();
      
      setRegistros(data.registros || []);
      setResumo({
        total_peso: data.total_peso,
        total_valor: data.total_valor_itens,
        total_dinheiro: data.total_dinheiro_in - data.total_dinheiro_out,
        resumo_itens: data.resumo_itens
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRegistro = async (username: string, slugProjeto: string, slugEdicao: string, dados: { aluno_id: number, grupo_id: number, tipo: string }) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/registros/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao criar registro base');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const addItemAoRegistro = async (username: string, slugProjeto: string, slugEdicao: string, registroId: number, itemId: number) => {
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/registros/${registroId}/itens/?item_id=${itemId}`;
      const res = await apiFetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao adicionar item ao registro');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const addDinheiroAoRegistro = async (username: string, slugProjeto: string, slugEdicao: string, registroId: number, valor: number) => {
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/registros/${registroId}/dinheiro/?valor=${valor}`;
      const res = await apiFetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao registrar valor em dinheiro');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteRegistro = async (username: string, slugProjeto: string, slugEdicao: string, registroId: number) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/registros/${registroId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir registro');
      setRegistros((prev) => prev.filter(r => r.id !== registroId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteItemRegistro = async (username: string, slugProjeto: string, slugEdicao: string, itemRegistroId: number) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/registros/itens/${itemRegistroId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao remover item');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateItemRegistro = async (username: string, slugProjeto: string, slugEdicao: string, itemRegistroId: number, novoItemId: number) => {
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/registros/itens/${itemRegistroId}/?novo_item_id=${novoItemId}`;
      const res = await apiFetch(url, { method: 'PUT' });
      if (!res.ok) throw new Error('Erro ao editar item do registro');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return {
    registros,
    resumo,
    isLoading,
    error,
    fetchRegistros,
    addRegistro,
    addItemAoRegistro,
    addDinheiroAoRegistro,
    deleteRegistro,
    deleteItemRegistro,
    updateItemRegistro
  };
}
