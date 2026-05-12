import { useState, useCallback } from 'react';
import { Grupo, Aluno } from '@/types';
import { apiFetch } from '@/services/api';

export function useGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [alunosSemGrupo, setAlunosSemGrupo] = useState<Aluno[]>([]);
  const [regras, setRegras] = useState({ min: 0, max: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca grupos de uma turma específica e as regras da edição
  const fetchGrupos = useCallback(async (username: string, slug_projeto: string, slug_edicao: string, slug_turma: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/${slug_turma}/grupos`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar grupos da turma');
      const data = await res.json();
      
      // Ajuste para o novo formato GrupoMestreOut que vem do backend
      setGrupos(data.grupos || []);
      setRegras({
        min: data.min_alunos_por_grupo,
        max: data.max_alunos_por_grupo,
        total: data.quantidade_total
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca alunos da turma que ainda não possuem grupo
  const fetchAlunosSemGrupo = useCallback(async (username: string, slug_projeto: string, slug_edicao: string, slug_turma: string) => {
    setIsLoading(true);
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/${slug_turma}/alunos-sem-grupo`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar alunos sem grupo');
      const data = await res.json();
      setAlunosSemGrupo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addGrupo = async (username: string, slug_projeto: string, slug_edicao: string, dados: Partial<Grupo>) => {
    try {
      const res = await apiFetch(`${username}/${slug_projeto}/${slug_edicao}/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao criar grupo');
      const novo = await res.json();
      setGrupos((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateGrupo = async (username: string, slug_projeto: string, slug_edicao: string, grupoId: number, dados: Partial<Grupo>) => {
    try {
      const res = await apiFetch(`${username}/${slug_projeto}/${slug_edicao}/grupos/${grupoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao atualizar grupo');
      const updated = await res.json();
      setGrupos((prev) => prev.map((g) => (g.id === grupoId ? updated : g)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteGrupo = async (username: string, slug_projeto: string, slug_edicao: string, grupoId: number) => {
    try {
      const res = await apiFetch(`${username}/${slug_projeto}/${slug_edicao}/grupos/${grupoId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir grupo');
      setGrupos((prev) => prev.filter((g) => g.id !== grupoId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const removerAlunoDoGrupo = async (username: string, slug_projeto: string, slug_edicao: string, grupoId: number, alunoId: number) => {
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/grupos/${grupoId}/remover/${alunoId}`;
      const res = await apiFetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao remover aluno do grupo');
      
      // Atualiza a lista local removendo o aluno do grupo específico
      setGrupos((prev) => prev.map(g => {
        if (g.id === grupoId) {
          return { ...g, alunos: g.alunos?.filter(a => a.id !== alunoId) };
        }
        return g;
      }));
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    grupos,
    alunosSemGrupo,
    regras,
    isLoading,
    error,
    fetchGrupos,
    fetchAlunosSemGrupo,
    addGrupo,
    updateGrupo,
    deleteGrupo,
    removerAlunoDoGrupo
  };
}
