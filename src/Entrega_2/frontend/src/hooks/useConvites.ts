import { useState, useCallback } from 'react';
import { Convite, Aluno } from '@/types';
import { apiFetch } from '@/services/api';

export function useConvites() {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [alunosSemGrupo, setAlunosSemGrupo] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca convites recebidos por um aluno específico na edição
  const fetchMeusConvites = useCallback(async (username: string, slug_projeto: string, slug_edicao: string, alunoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/meus-convites/${alunoId}?status=pendente`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Erro ao buscar convites');
      const data = await res.json();
      setConvites(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca alunos que ainda não possuem grupo para serem convidados (Usa nova rota do backend)
  const fetchAlunosSemGrupo = useCallback(async (username: string, slug_projeto: string, slug_edicao: string) => {
    setIsLoading(true);
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/alunos-sem-grupo`;
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Erro ao buscar alunos sem grupo');
      const data = await res.json();
      setAlunosSemGrupo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const responderConvite = async (username: string, slug_projeto: string, slug_edicao: string, conviteId: number, status: 'aceito' | 'negado') => {
    try {
      // Backend espera novo_status como query parameter: /convites/{id}?novo_status=aceito
      const url = `${username}/${slug_projeto}/${slug_edicao}/convites/${conviteId}?novo_status=${status}`;
      const res = await apiFetch(url, { method: 'PUT' });
      
      if (!res.ok) throw new Error('Erro ao responder convite');
      
      const updated = await res.json();
      // Remove da lista local após responder
      setConvites((prev) => prev.filter(c => c.id !== conviteId));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const enviarConvite = async (username: string, slug_projeto: string, slug_edicao: string, dados: { criador_id: number, convidado_id: number, grupo_id: number }) => {
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/convites`;
      const res = await apiFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error('Erro ao enviar convite');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteConvite = async (username: string, slug_projeto: string, slug_edicao: string, conviteId: number) => {
    try {
      const url = `${username}/${slug_projeto}/${slug_edicao}/convites/${conviteId}`;
      const res = await apiFetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao cancelar convite');
      setConvites((prev) => prev.filter(c => c.id !== conviteId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    convites,
    alunosSemGrupo,
    isLoading,
    error,
    fetchMeusConvites,
    fetchAlunosSemGrupo,
    responderConvite,
    enviarConvite,
    deleteConvite
  };
}
