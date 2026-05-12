import { useState, useCallback } from 'react';
import { Edicao } from '@/types';
import { apiFetch } from '@/services/api';

export function useEdicoes() {
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lista todas as edições de um projeto
  const fetchEdicoes = useCallback(async (username: string, slugProjeto: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/edicoes/`);
      if (!res.ok) throw new Error('Falha ao carregar edições');
      const data = await res.json();
      setEdicoes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca uma edição específica pelo slug (Mais eficiente)
  const fetchEdicaoBySlug = useCallback(async (username: string, slugProjeto: string, slugEdicao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/edicoes/${slugEdicao}/`);
      if (!res.ok) throw new Error('Falha ao buscar detalhes da edição');
      const data = await res.json();
      setEdicao(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEdicao = async (username: string, slugProjeto: string, dados: Partial<Edicao>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/edicoes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao criar edição');
      const nova = await res.json();
      setEdicoes((prev) => [...prev, nova]);
      return nova;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateEdicao = async (username: string, slugProjeto: string, slugEdicao: string, dados: Partial<Edicao>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/edicoes/${slugEdicao}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao atualizar edição');
      const updated = await res.json();
      setEdicao(updated);
      setEdicoes((prev) => prev.map(e => e.slug === slugEdicao ? updated : e));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteEdicao = async (username: string, slugProjeto: string, slugEdicao: string) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/edicoes/${slugEdicao}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar edição');
      setEdicoes((prev) => prev.filter(e => e.slug !== slugEdicao));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { 
    edicoes, 
    edicao, 
    isLoading, 
    error, 
    fetchEdicoes, 
    fetchEdicaoBySlug, 
    addEdicao, 
    updateEdicao, 
    deleteEdicao 
  };
}
