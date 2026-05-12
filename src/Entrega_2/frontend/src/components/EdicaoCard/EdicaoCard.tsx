'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './EdicaoCard.module.css';
import { Edicao } from '@/types';


export default function EdicaoCard({ edicao }: { edicao: Edicao }) {
  const params = useParams();
  const username = params.username as string;
  const slugProjeto = params.slug_projeto as string;

  // Lógica de ativação dinâmica baseada em data
  const hoje = new Date();
  const inicio = new Date(edicao.data_inicio);
  const fim = new Date(edicao.data_fim);
  const estaAtivo = hoje >= inicio && hoje <= fim;

  // Link para entrar na área de turmas do desafio
  const hrefLink = `/${username}/${slugProjeto}/${edicao.slug}`;

  return (
    <div className={styles.card}>
      <Link href={hrefLink} className={styles.linkWrapper}>
        <div className={styles.banner}>
          <img 
            src={edicao.imagem || edicao.projeto?.imagem || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} 
            alt={edicao.nome} 
            className={styles.image} 
          />
          <div className={`${styles.statusBadge} ${estaAtivo ? styles.active : styles.inactive}`}>
            {estaAtivo ? 'ATIVO' : 'ENCERRADO'}
          </div>
        </div>
        
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.nome}>{edicao.nome}</h3>
            <span className={`${styles.statusDot} ${estaAtivo ? styles.activeDot : styles.inactiveDot}`}></span>
          </div>
          
          <div className={styles.meta}>
            <span className="material-symbols-outlined">event</span>
            <span>
              {new Date(edicao.data_inicio).toLocaleDateString('pt-BR')} — {new Date(edicao.data_fim).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className={styles.actionRow}>
            <span>Acessar Edição</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>
      </Link>
    </div>
  );
}