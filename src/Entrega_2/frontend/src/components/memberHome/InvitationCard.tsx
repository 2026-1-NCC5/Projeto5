'use client';

import React from 'react';
import styles from './InvitationCard.module.css';
import { Convite } from '@/types';

interface InvitationCardProps {
  convites: Convite[];
  onResponder: (id: string | number, status: 'aceito' | 'recusado') => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ convites, onResponder }) => {
  if (convites.length === 0) return null;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className="material-symbols-outlined">group_add</span>
        <h2>Convites de Grupo Pendentes</h2>
      </div>
      <div className={styles.list}>
        {convites.map((convite) => (
          <div key={convite.id} className={styles.inviteItem}>
            <div className={styles.info}>
              <p className={styles.mainText}>
                <strong>{convite.nome_criador}</strong> convidou você para o grupo <strong>{convite.nome_grupo}</strong>
              </p>
              <span className={styles.date}>
                {new Date(convite.data_criacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.acceptBtn}
                onClick={() => onResponder(convite.id, 'aceito')}
              >
                Aceitar
              </button>
              <button 
                className={styles.rejectBtn}
                onClick={() => onResponder(convite.id, 'recusado')}
              >
                Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
