'use client';

import { useState, useEffect } from 'react';
import { MetricasDashboard } from '@/types';
import { Rankings } from '@/components/metricasPage/Rankings';
import { useMetricas } from '@/hooks/useMetricas';
import styles from '../page.module.css'; // Reuse some styles
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FullRankingPage() {
  const { username, slug_projeto, slug_edicao } = useParams();
  const { metricas, fetchMetricas, isLoading } = useMetricas();

  useEffect(() => {
    if (username && slug_projeto && slug_edicao) {
      fetchMetricas(username as string, slug_projeto as string, slug_edicao as string);
    }
  }, [username, slug_projeto, slug_edicao, fetchMetricas]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Link href={`/${username}/${slug_projeto}/${slug_edicao}/metricas`} className={styles.backLink}>
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
