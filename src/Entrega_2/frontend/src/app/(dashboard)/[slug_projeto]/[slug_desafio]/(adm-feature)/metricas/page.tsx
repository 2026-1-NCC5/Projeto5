'use client';

import { useState, useEffect } from 'react';
import { MetricasDashboard, Turma } from '@/types';
import { MetricasFilters } from '@/components/metricasPage/MetricasFilters';
import { SummaryCards } from '@/components/metricasPage/SummaryCards';
import { LineChartCard, PieChartCard } from '@/components/metricasPage/Charts';
import { ItemsGrouping } from '@/components/metricasPage/ItemsGrouping';
import { Rankings } from '@/components/metricasPage/Rankings';
import styles from './page.module.css';

export default function MetricasPage() {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<Turma[]>([]);
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch for Turmas and initial Metricas
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resTurmas = await fetch('/api/turmas');
        if (resTurmas.ok) {
          const dataTurmas = await resTurmas.json();
          setTurmasDisponiveis(dataTurmas);
          // By default, select all turmas initially
          setSelectedTurmas(dataTurmas.map((t: Turma) => t.id.toString()));
          
          // Set default dates (last 30 days)
          const today = new Date();
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          setDataFim(today.toISOString().split('T')[0]);
          setDataInicio(thirtyDaysAgo.toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar turmas', error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch metricas whenever filters change
  useEffect(() => {
    if (selectedTurmas.length === 0 && turmasDisponiveis.length === 0) return;

    const fetchMetricas = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);
        selectedTurmas.forEach(t => params.append('turmas', t));

        const res = await fetch(`/api/metricas?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMetricas(data);
        }
      } catch (error) {
        console.error('Erro ao buscar métricas', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetricas();
  }, [selectedTurmas, dataInicio, dataFim, turmasDisponiveis]);

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
          <div className={styles.topSection}>
            <SummaryCards data={metricas} />
            <Rankings data={metricas} limit={5} />
          </div>

          <MetricasFilters 
            turmas={turmasDisponiveis}
            selectedTurmas={selectedTurmas}
            setSelectedTurmas={setSelectedTurmas}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
          />
          
          <div className={styles.chartsSection}>
            <LineChartCard data={metricas} />
            
            <div className={styles.pieAndTableGrid}>
              <PieChartCard data={metricas} />
              <ItemsGrouping data={metricas} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.error}>Erro ao carregar o dashboard de métricas.</div>
      )}
    </main>
  );
}
