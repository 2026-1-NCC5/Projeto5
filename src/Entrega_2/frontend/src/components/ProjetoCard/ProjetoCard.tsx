'use client';
import Link from 'next/link';
import styles from './ProjetoCard.module.css';
import { Projeto } from '@/types';
import { useParams } from 'next/navigation';

export default function ProjetoCard({ projeto }: { projeto: Projeto }) {
  const { username } = useParams();
  const hrefLink = `/${username}/${projeto.slug}`;

  return (
    <div className={styles.card}>
      <Link href={hrefLink} className={styles.linkWrapper}>
        <div className={styles.banner}>
          <img src={projeto.imagem || projeto?.imagem || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} alt={projeto.nome} className={styles.image} />
          <div className={`${styles.roleBadge} ${projeto.papel === 'adm' ? styles.adm : styles.membro}`}>
            {projeto.papel?.toUpperCase() || 'MEMBRO'}
          </div>
        </div>
        
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.nome}>{projeto.nome}</h3>
            <span className={`${styles.statusDot} ${projeto.status === 'ativo' ? styles.activeDot : styles.inactiveDot}`}></span>
          </div>
          
          <p className={styles.tipoLabel}>{projeto.tipo}</p>

          <div className={styles.meta}>
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Desde {projeto.data_criacao}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}