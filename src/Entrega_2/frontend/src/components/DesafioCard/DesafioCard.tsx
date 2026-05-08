'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './DesafioCard.module.css';

interface Desafio {
  id: string | number;
  nome: string;
  slug: string;
  dataInicio: string; // Formato YYYY-MM-DD
  dataFim: string;    // Formato YYYY-MM-DD
  imagem?: string;
}

export default function DesafioCard({ desafio }: { desafio: Desafio }) {
  const params = useParams();
  const slugProjeto = params.slug_projeto as string;

  // Lógica de ativação dinâmica baseada em data
  const hoje = new Date();
  const inicio = new Date(desafio.dataInicio);
  const fim = new Date(desafio.dataFim);
  const estaAtivo = hoje >= inicio && hoje <= fim;

  // Link para entrar na área de turmas do desafio
  const hrefLink = `/${slugProjeto}/${desafio.slug}`;

  return (
    <div className={styles.card}>
      <Link href={hrefLink} className={styles.linkWrapper}>
        <div className={styles.banner}>
          <img 
            src={desafio.imagem || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} 
            alt={desafio.nome} 
            className={styles.image} 
          />
          <div className={`${styles.statusBadge} ${estaAtivo ? styles.active : styles.inactive}`}>
            {estaAtivo ? 'ATIVO' : 'ENCERRADO'}
          </div>
        </div>
        
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.nome}>{desafio.nome}</h3>
            <span className={`${styles.statusDot} ${estaAtivo ? styles.activeDot : styles.inactiveDot}`}></span>
          </div>
          
          <div className={styles.meta}>
            <span className="material-symbols-outlined">event</span>
            <span>
              {new Date(desafio.dataInicio).toLocaleDateString('pt-BR')} — {new Date(desafio.dataFim).toLocaleDateString('pt-BR')}
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