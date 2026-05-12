import { useState, useCallback } from 'react';
import { MetricasDashboard } from '@/types';
import { apiFetch } from '@/services/api';

export function useMetricas() {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetricas = useCallback(async (
    username: string, 
    slug_projeto: string, 
    slug_edicao: string, 
    filtros?: { data_inicio?: string; data_fim?: string; turma_ids?: number[] }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
      if (filtros?.turma_ids?.length) {
        filtros.turma_ids.forEach(id => params.append('turma_ids', id.toString()));
      }

      const queryString = params.toString();
      const url = `${username}/${slug_projeto}/${slug_edicao}/metricas/` + (queryString ? `?${queryString}` : '');
      
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Falha ao buscar métricas do dashboard');
      const data = await res.json();
      setMetricas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { metricas, isLoading, error, fetchMetricas };
}
