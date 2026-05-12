import Link from 'next/link';
import { Turma } from '@/types';
import styles from './TurmaCard.module.css';

interface TurmaCardProps {
  turma: Turma;
  username: string;
  slugProjeto: string;
  slugEdicao: string;
}

export function TurmaCard({ turma, username, slugProjeto, slugEdicao }: TurmaCardProps) {
  return (
    <Link 
      href={`/${username}/${slugProjeto}/${slugEdicao}/${turma.slug}`}
      className={styles.turmaCard}
    >
      <span className={styles.cardCodigo}>{turma.slug}</span>
      <h3 className={styles.cardTitle}>{turma.nome}</h3>
      <p className={styles.cardStats}>{turma.qtd_alunos} alunos inscritos</p>
    </Link>
  );
}
