import { useState, useCallback } from 'react';
import { Turma } from '@/types';
import { apiFetch } from '@/services/api';

export function useTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lista todas as turmas de uma edição
  const fetchTurmas = useCallback(async (username: string, slugProjeto: string, slugEdicao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/turmas/`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar turmas');
      const data = await res.json();
      setTurmas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca uma turma específica pelo slug
  const fetchTurmaBySlug = useCallback(async (username: string, slugProjeto: string, slugEdicao: string, slugTurma: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/turmas/${slugTurma}/`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao buscar detalhes da turma');
      const data = await res.json();
      setTurma(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTurma = async (username: string, slugProjeto: string, slugEdicao: string, dados: Partial<Turma>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/turmas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao adicionar turma');
      const nova = await res.json();
      setTurmas((prev) => [...prev, nova]);
      return nova;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateTurma = async (username: string, slugProjeto: string, slugEdicao: string, slugTurma: string, dados: Partial<Turma>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/turmas/${slugTurma}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao atualizar turma');
      const updated = await res.json();
      setTurmas((prev) => prev.map((t) => (t.slug === slugTurma ? updated : t)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteTurma = async (username: string, slugProjeto: string, slugEdicao: string, slugTurma: string) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/turmas/${slugTurma}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar turma');
      setTurmas((prev) => prev.filter((t) => t.slug !== slugTurma));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    turmas,
    turma,
    isLoading,
    error,
    fetchTurmas,
    fetchTurmaBySlug,
    addTurma,
    updateTurma,
    deleteTurma
  };
}
