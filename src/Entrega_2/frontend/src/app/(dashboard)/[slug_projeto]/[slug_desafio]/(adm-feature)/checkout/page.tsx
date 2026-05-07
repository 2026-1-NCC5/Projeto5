'use client';

import React from 'react';
import styles from './page.module.css';
import { useCheckoutAI } from '@/hooks/useCheckoutAI';
import { VisionPanel } from '@/components/Checkout/VisionPanel';
import { ScannedItemsLog } from '@/components/Checkout/ScannedItemsLog';
import { ItemsSummary } from '@/components/Checkout/ItemsSummary';
import { CalibrationPanel } from '@/components/Checkout/CalibrationPanel';
import { CheckoutService } from '@/services/checkoutService';
import { useState } from 'react';

export default function CheckoutPage() {
  const {
    itens,
    engineStatus,
    camStatus,
    cooldown,
    setCooldown,
    isCalibrating,
    setIsCalibrating,
    calibrationSize,
    setCalibrationSize,
    videoRef,
    canvasRef,
    handleCancel
  } = useCheckoutAI();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (itens.length === 0) {
      alert('O carrinho está vazio!');
      return;
    }

    if (!confirm('Deseja finalizar a conferência de itens?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await CheckoutService.submitVerification(itens);
      alert('Conferência finalizada com sucesso!');
      handleCancel(); // Limpa o carrinho
    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar conferência. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1>Checkout Inteligente</h1>
          <p>Detecção de produtos em tempo real via ScanCount AI</p>
        </div>
        <button 
          className={styles.finishBtn} 
          onClick={handleFinish}
          disabled={isSubmitting || itens.length === 0}
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar Conferência'}
        </button>
      </header>

      <div className={styles.contentGrid}>
        {/* Lado Esquerdo: Visão e Configurações */}
        <div className={styles.leftColumn}>
          <CalibrationPanel 
            isCalibrating={isCalibrating}
            setIsCalibrating={setIsCalibrating}
            calibrationSize={calibrationSize}
            setCalibrationSize={setCalibrationSize}
            cooldown={cooldown}
            setCooldown={setCooldown}
          />
          <VisionPanel 
            videoRef={videoRef}
            canvasRef={canvasRef}
            engineStatus={engineStatus}
            camStatus={camStatus}
          />
        </div>

        {/* Lado Direito: Fluxo e Síntese */}
        <div className={styles.rightColumn}>
          <div className={styles.sidebarContent}>
            <ScannedItemsLog itens={itens} />
            <ItemsSummary itens={itens} />
            
            {itens.length > 0 && (
              <button className={styles.clearBtn} onClick={handleCancel}>
                Reiniciar Carrinho
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}