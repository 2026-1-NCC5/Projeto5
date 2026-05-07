import Link from 'next/link';
import { Turma } from '@/types';
import styles from './TurmaCard.module.css';

interface TurmaCardProps {
  turma: Turma;
  slugProjeto: string;
  slugDesafio: string;
}

export function TurmaCard({ turma, slugProjeto, slugDesafio }: TurmaCardProps) {
  return (
    <Link 
      href={`/${slugProjeto}/${slugDesafio}/${turma.slug}`}
      className={styles.turmaCard}
    >
      <span className={styles.cardCodigo}>{turma.slug}</span>
      <h3 className={styles.cardTitle}>{turma.nome}</h3>
      <p className={styles.cardStats}>{turma.quantidade} alunos inscritos</p>
    </Link>
  );
}
