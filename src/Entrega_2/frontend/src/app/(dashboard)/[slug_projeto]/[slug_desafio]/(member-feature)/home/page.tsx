'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { MetricasDashboard } from '@/types';
import { RankingCard } from '@/components/memberHome/RankingCard';
import { HistoryCard } from '@/components/memberHome/HistoryCard';

interface RegistroDetalhe {
  nome: string;
  qtd: number;
  peso: number;
  valor: number;
}

interface RegistroHistory {
  id: number;
  data: string;
  tipo: 'itens' | 'dinheiro' | 'resgate';
  alunoNome: string;
  grupoNome: string;
  totalPeso: number;
  totalValor: number;
  detalhes?: RegistroDetalhe[];
}

export default function MemberHomePage() {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [historico, setHistorico] = useState<RegistroHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Nome do grupo do usuário atual (simulado pelo bypass)
  const meuGrupoNome = 'Alpha';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resMetricas, resHistory] = await Promise.all([
          fetch('/api/metricas'),
          fetch('/api/registros/me')
        ]);

        if (resMetricas.ok) setMetricas(await resMetricas.ok ? await resMetricas.json() : null);
        if (resHistory.ok) setHistorico(await resHistory.json());
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1>Bem-vindo ao Dashboard</h1>
        <p>Acompanhe o desempenho do seu grupo e seu histórico de contribuições.</p>
      </header>

      <div className={styles.grid}>
        <RankingCard 
          ranking={metricas?.rankingGrupos || []} 
          meuGrupoNome={meuGrupoNome} 
        />
        
        <HistoryCard 
          historico={historico} 
          grupoNome={meuGrupoNome} 
        />
      </div>
    </main>
  );
}
