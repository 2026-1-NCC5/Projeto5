'use client';

import Link from 'next/link';
import styles from './ResourceNotFound.module.css';

interface ResourceNotFoundProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionPath?: string;
}

export default function ResourceNotFound({
  title = "Recurso não encontrado",
  message = "O projeto, edição ou turma que você está procurando não existe ou você não tem permissão para acessá-lo.",
  actionText = "Voltar para meus projetos",
  actionPath = "/"
}: ResourceNotFoundProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined">explore_off</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
        <Link href={actionPath} className={styles.actionBtn}>
          {actionText}
        </Link>
      </div>
    </div>
  );
}
