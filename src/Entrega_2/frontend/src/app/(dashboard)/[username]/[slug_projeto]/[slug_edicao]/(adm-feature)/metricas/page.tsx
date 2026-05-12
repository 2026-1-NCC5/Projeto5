'use client';

import { useState, useEffect } from 'react';
import { MetricasDashboard, Turma } from '@/types';
import { MetricasFilters } from '@/components/metricasPage/MetricasFilters';
import { SummaryCards } from '@/components/metricasPage/SummaryCards';
import { LineChartCard, PieChartCard } from '@/components/metricasPage/Charts';
import { ItemsGrouping } from '@/components/metricasPage/ItemsGrouping';
import { Rankings } from '@/components/metricasPage/Rankings';
import styles from './page.module.css';

import { useMetricas } from '@/hooks/useMetricas';
import { useTurmas } from '@/hooks/useTurmas';

import { useParams } from 'next/navigation';

export default function MetricasPage() {
  const { username, slug_projeto, slug_edicao } = useParams();
  const { metricas, fetchMetricas, isLoading: isLoadingMetricas } = useMetricas();
  const { turmas: turmasDisponiveis, fetchTurmas } = useTurmas();
  
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch for Turmas and setup default filters
  useEffect(() => {
    const init = async () => {
      await fetchTurmas(username as string, slug_projeto as string, slug_edicao as string);
      
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      setDataFim(today.toISOString().split('T')[0]);
      setDataInicio(thirtyDaysAgo.toISOString().split('T')[0]);
    };
    init();
  }, [fetchTurmas, username, slug_projeto, slug_edicao]);

  // Set default selected turmas when available
  useEffect(() => {
    if (turmasDisponiveis.length > 0 && selectedTurmas.length === 0) {
      setSelectedTurmas(turmasDisponiveis.map(t => t.id.toString()));
    }
  }, [turmasDisponiveis, selectedTurmas.length]);

  // Fetch metricas whenever filters change
  useEffect(() => {
    if (selectedTurmas.length === 0 && turmasDisponiveis.length === 0) return;
    
    setIsLoading(true);
    fetchMetricas(username as string, slug_projeto as string, slug_edicao as string, { data: dataInicio, turmas: selectedTurmas })
      .finally(() => setIsLoading(false));
  }, [selectedTurmas, dataInicio, dataFim, turmasDisponiveis.length, fetchMetricas, username, slug_projeto, slug_edicao]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Dashboard de Métricas</h1>
          <p className={styles.subtitle}>Acompanhe o desempenho das arrecadações em tempo real.</p>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Calculando métricas do período...</div>
      ) : metricas ? (
        <div className={styles.dashboardContent}>
          {/* 1. Cards no Topo (Linha única) */}
          <section className={styles.summarySection}>
            <SummaryCards data={metricas} />
          </section>

          {/* 2. Filtros */}
          <MetricasFilters 
            turmas={turmasDisponiveis}
            selectedTurmas={selectedTurmas}
            setSelectedTurmas={setSelectedTurmas}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
          />
          
          {/* 3. Gráfico de Linha */}
          <section className={styles.chartFullWidth}>
            <LineChartCard data={metricas} />
          </section>

          {/* 4. Pizza e Tabela */}
          <div className={styles.pieAndTableGrid}>
            <PieChartCard data={metricas} />
            <ItemsGrouping data={metricas} />
          </div>

          {/* 5. Rankings lado a lado no rodapé */}
          <section className={styles.bottomSection}>
            <Rankings data={metricas} limit={5} />
          </section>
        </div>
      ) : (
        <div className={styles.error}>Erro ao carregar o dashboard de métricas.</div>
      )}
    </main>
  );
}
