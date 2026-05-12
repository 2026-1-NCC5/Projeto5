import { useState, useCallback } from 'react';
import { Aluno } from '@/types';
import { apiFetch } from '@/services/api';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca TODOS os alunos da edição
  const fetchAlunos = useCallback(async (username: string, slugProjeto: string, slugEdicao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/alunos/`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar alunos da edição');
      const data = await res.json();
      setAlunos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca alunos de uma TURMA específica
  const fetchAlunosByTurma = useCallback(async (username: string, slugProjeto: string, slugEdicao: string, slugTurma: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/${slugTurma}/alunos/`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao carregar alunos da turma');
      const data = await res.json();
      setAlunos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca um aluno específico pelo ID
  const fetchAlunoById = useCallback(async (username: string, slugProjeto: string, slugEdicao: string, alunoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/alunos/${alunoId}/`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao buscar detalhes do aluno');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAluno = async (username: string, slugProjeto: string, slugEdicao: string, aluno: Partial<Aluno>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/alunos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });
      if (!res.ok) throw new Error('Erro ao adicionar aluno');
      const newAluno = await res.json();
      setAlunos((prev) => [...prev, newAluno]);
      return newAluno;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateAluno = async (username: string, slugProjeto: string, slugEdicao: string, alunoId: number, dados: Partial<Aluno>) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/alunos/${alunoId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao atualizar aluno');
      const updated = await res.json();
      setAlunos((prev) => prev.map((a) => (a.id === alunoId ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteAluno = async (username: string, slugProjeto: string, slugEdicao: string, alunoId: number) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/alunos/${alunoId}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir aluno');
      setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const vincularUsuario = async (username: string, slugProjeto: string, slugEdicao: string, alunoId: number, usuarioId: number) => {
    try {
      const url = `${username}/${slugProjeto}/${slugEdicao}/alunos/${alunoId}/vincular-usuario/${usuarioId}`;
      const res = await apiFetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao vincular usuário ao aluno');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { 
    alunos, 
    isLoading, 
    error, 
    fetchAlunos, 
    fetchAlunosByTurma,
    fetchAlunoById,
    addAluno, 
    updateAluno, 
    deleteAluno,
    vincularUsuario
  };
}
