'use client';

import React from 'react';
import styles from './RankingCard.module.css';

interface RankingItem {
  posicao: number;
  nome: string;
  quilos: number;
  dinheiro: number;
}

interface RankingCardProps {
  ranking: RankingItem[];
  meuGrupoNome: string;
}

export const RankingCard: React.FC<RankingCardProps> = ({ ranking, meuGrupoNome }) => {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>
          <span className="material-symbols-outlined">military_tech</span>
          Ranking de Grupos
        </h2>
      </div>
      <div className={styles.rankingList}>
        {ranking.slice(0, 10).map((item) => (
          <div 
            key={item.posicao} 
            className={`${styles.rankingItem} ${item.nome === meuGrupoNome ? styles.isMyGroup : ''}`}
          >
            <span className={styles.pos}>#{item.posicao}</span>
            <div className={styles.groupInfo}>
              <span className={styles.groupName}>
                {item.nome}
                {item.nome === meuGrupoNome && <span className={styles.myGroupTag}>Meu Grupo</span>}
              </span>
            </div>
            <div className={styles.groupStats}>
              <b>{item.quilos.toFixed(1)}</b> kg
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
