import { useState, useCallback } from 'react';
import { Projeto } from '@/types';
import { apiFetch } from '@/services/api';

export function useProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lista todos os projetos de um usuário
  const fetchProjetos = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${username}/projetos/`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setProjetos(data);
      } else {
        throw new Error('Falha ao carregar projetos: Resposta inválida');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca um projeto específico pelo slug (Mais eficiente)
  const fetchProjetoBySlug = useCallback(async (username: string, slug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${username}/projetos/${slug}/`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setProjeto(data);
        return data;
      } else {
        throw new Error('Falha ao buscar detalhes do projeto: Resposta inválida');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProjeto = async (username: string, dados: Partial<Projeto>) => {
    try {
      const res = await apiFetch(`${username}/projetos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const novo = await res.json();
        setProjetos((prev) => [...prev, novo]);
        return novo;
      } else {
        throw new Error('Erro ao criar projeto: Resposta inválida');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateProjeto = async (username: string, slug: string, dados: Partial<Projeto>) => {
    try {
      const res = await apiFetch(`${username}/projetos/${slug}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const atualizado = await res.json();
        setProjetos((prev) => prev.map(p => p.slug === slug ? atualizado : p));
        return atualizado;
      } else {
        throw new Error('Erro ao atualizar projeto: Resposta inválida');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteProjeto = async (username: string, slug: string) => {
    try {
      const res = await apiFetch(`${username}/projetos/${slug}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar projeto');
      setProjetos((prev) => prev.filter(p => p.slug !== slug));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    projetos,
    projeto,
    isLoading,
    error,
    fetchProjetos,
    fetchProjetoBySlug,
    addProjeto,
    updateProjeto,
    deleteProjeto
  };
}
