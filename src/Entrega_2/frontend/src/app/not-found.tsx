import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Página não encontrada</h2>
        <p className={styles.message}>
          Parece que você se perdeu no inventário. O recurso que você procura não existe ou foi movido.
        </p>
        <Link href="/" className={styles.backButton}>
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
