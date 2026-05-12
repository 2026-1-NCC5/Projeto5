'use client';

import React from 'react';
import styles from './RankingCard.module.css';

import { RankingItem } from '@/types';

interface RankingCardProps {
  ranking: RankingItem[];
  meuGrupoNome: string;
}

export const RankingCard: React.FC<RankingCardProps> = ({ ranking, meuGrupoNome }) => {
  const top3 = ranking.slice(0, 3);
  const userRank = ranking.find(item => item.nome === meuGrupoNome);
  const isInTop3 = top3.some(item => item.nome === meuGrupoNome);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>
          <span className="material-symbols-outlined">military_tech</span>
          Ranking do Desafio (Top 3)
        </h2>
      </div>
      <div className={styles.rankingList}>
        {top3.map((item) => (
          <div 
            key={item.posicao} 
            className={`${styles.rankingItem} ${item.nome === meuGrupoNome ? styles.isMyGroup : ''} ${styles[`pos${item.posicao}`]}`}
          >
            <span className={styles.pos}>
              {item.posicao === 1 ? '🥇' : item.posicao === 2 ? '🥈' : '🥉'}
            </span>
            <div className={styles.groupInfo}>
              <span className={styles.groupName}>
                {item.nome}
                {item.nome === meuGrupoNome && <span className={styles.myGroupTag}>Meu Grupo</span>}
              </span>
            </div>
            <div className={styles.groupStats}>
              <b>{item.kg.toFixed(1)}</b> kg
            </div>
          </div>
        ))}

        {userRank && !isInTop3 && (
          <>
            <div className={styles.separator}>•••</div>
            <div className={`${styles.rankingItem} ${styles.isMyGroup}`}>
              <span className={styles.pos}>#{userRank.posicao}</span>
              <div className={styles.groupInfo}>
                <span className={styles.groupName}>
                  {userRank.nome}
                  <span className={styles.myGroupTag}>Meu Grupo</span>
                </span>
              </div>
              <div className={styles.groupStats}>
                <b>{userRank.kg.toFixed(1)}</b> kg
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
