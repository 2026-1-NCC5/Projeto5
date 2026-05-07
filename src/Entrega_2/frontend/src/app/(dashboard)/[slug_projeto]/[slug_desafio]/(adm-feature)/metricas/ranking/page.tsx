'use client';

import { useState, useEffect } from 'react';
import { MetricasDashboard } from '@/types';
import { Rankings } from '@/components/metricasPage/Rankings';
import styles from '../page.module.css'; // Reuse some styles
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FullRankingPage() {
  const { slug_projeto, slug_desafio } = useParams();
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const res = await fetch('/api/metricas');
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
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Link href={`/projeto/${slug_projeto}/desafios/${slug_desafio}/metricas`} className={styles.backLink}>
            ← Voltar para o Dashboard
          </Link>
          <h1 className={styles.title}>Ranking Completo</h1>
          <p className={styles.subtitle}>Desempenho detalhado de todos os grupos e turmas.</p>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Carregando rankings...</div>
      ) : metricas ? (
        <div className={styles.dashboardContent}>
          <Rankings data={metricas} />
        </div>
      ) : (
        <div className={styles.error}>Erro ao carregar os rankings.</div>
      )}
    </main>
  );
}
