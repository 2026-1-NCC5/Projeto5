'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckoutSession, CheckoutItemSynthesis } from '@/types';
import { SynthesisTable } from '@/components/Checkout/SynthesisTable';
import { CheckoutHistoryTable } from '@/components/Checkout/CheckoutHistoryTable';
import styles from './page.module.css';

import { useCheckout } from '@/hooks/useCheckout';

export default function CheckoutOverviewPage() {
  const params = useParams();
  const { username, slug_projeto, slug_edicao } = params;
  const { historico, sintese, isLoading, error, fetchCheckoutData } = useCheckout();
  useEffect(() => {
    fetchCheckoutData(username as string, slug_projeto as string, slug_edicao as string);
  }, [fetchCheckoutData, username, slug_projeto, slug_edicao]);

  const basePath = `/${username}/${slug_projeto}/${slug_edicao}/checkout`;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Painel de Conferência (Checkout)</h1>
          <p className={styles.subtitle}>Acompanhe o progresso da verificação de itens registrados.</p>
        </div>
        
        <Link href={`${basePath}/scanner`} className={styles.newSessionBtn}>
          <span className="material-symbols-outlined">add_a_photo</span>
          Iniciar Nova Conferência
        </Link>
      </header>

      {isLoading ? (
        <p>Carregando dados de checkout...</p>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>Erro ao carregar dados: {error}</p>
        </div>
      ) : (
        <div className={styles.content}>
          <SynthesisTable data={sintese} />
          <CheckoutHistoryTable sessions={historico} />
        </div>
      )}
    </main>
  );
}
