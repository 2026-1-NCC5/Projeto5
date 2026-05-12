import { useState, useCallback } from 'react';
import { CheckoutSession, CheckoutItemSynthesis } from '@/types';
import { apiFetch } from '@/services/api';

export function useCheckout() {
  const [historico, setHistorico] = useState<CheckoutSession[]>([]);
  const [sintese, setSintese] = useState<CheckoutItemSynthesis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca todos os checkouts e calcula a síntese comparando com registros dos alunos
  const fetchCheckoutData = useCallback(async (username: string, slugProjeto: string, slugEdicao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Busca Histórico de Checkouts (ADM)
      // Garantimos que a URL termine com / para o FastAPI
      const resCheckouts = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/checkout/`);
      if (!resCheckouts.ok) throw new Error(`Falha ao carregar checkouts: ${resCheckouts.status}`);
      const rawCheckouts = await resCheckouts.json();
      
      const mappedCheckouts = (Array.isArray(rawCheckouts) ? rawCheckouts : []).map((item: any) => ({
        ...item,
        data: item.data_criacao
      }));
      setHistorico(mappedCheckouts);

      // 2. Busca Resumo de Registros (Alunos) para definir a "Meta"
      const resRegistros = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/registros/`);
      if (!resRegistros.ok) throw new Error(`Falha ao carregar registros: ${resRegistros.status}`);
      const dataRegistros = await resRegistros.json();
      const resumoAlunos = dataRegistros.resumo_por_item || [];

      // 3. Consolida a Síntese
      // Agrupamos o que já foi realizado em todos os checkouts
      const realizadoMap: Record<string, number> = {};
      mappedCheckouts.forEach((session: any) => {
        session.itens_resumo?.forEach((itemGroup: any) => {
          const nome = itemGroup.item.nome;
          realizadoMap[nome] = (realizadoMap[nome] || 0) + itemGroup.quantidade;
        });
      });

      // Montamos a lista final comparando Alunos vs ADM
      const novaSintese: CheckoutItemSynthesis[] = resumoAlunos.map((reg: any) => ({
        item_nome: reg.nome,
        meta_alunos: reg.quantidade,
        realizado_edicao: realizadoMap[reg.nome] || 0
      }));

      setSintese(novaSintese);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitConferencia = async (username: string, slugProjeto: string, slugEdicao: string, dados: { adm_id: number, itens_ids: number[] }) => {
    setIsLoading(true);
    try {
      const payload = {
        adm_id: dados.adm_id,
        itens_ids: dados.itens_ids
      };

      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/checkout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error('Erro ao processar checkout');
      
      const newCheckoutRaw = await res.json();
      
      const newCheckout = {
        ...newCheckoutRaw,
        data: newCheckoutRaw.data_criacao
      };

      setHistorico((prev) => [newCheckout, ...prev]);
      return newCheckout;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCheckout = async (username: string, slugProjeto: string, slugEdicao: string, checkoutId: number) => {
    try {
      const res = await apiFetch(`${username}/${slugProjeto}/${slugEdicao}/checkout/${checkoutId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar registro de checkout');
      setHistorico((prev) => prev.filter(c => c.id !== checkoutId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    historico,
    sintese,
    isLoading,
    error,
    fetchCheckoutData,
    submitConferencia,
    deleteCheckout
  };
}
