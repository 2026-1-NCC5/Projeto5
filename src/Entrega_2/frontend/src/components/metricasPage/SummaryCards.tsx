import { MetricasDashboard } from '@/types';
import styles from './SummaryCards.module.css';

interface SummaryCardsProps {
  data: MetricasDashboard;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  
  const formatWeight = (kg: number) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(2)} t`;
    }
    return `${kg.toFixed(2)} kg`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Totais</h3>
        <div className={styles.compactGrid}>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{formatWeight(data.resumo.total_kg)}</span>
            <span className={styles.description}>arrecadados</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{formatCurrency(data.resumo.total_dinheiro)}</span>
            <span className={styles.description}>em doações</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Participação</h3>
        <div className={styles.compactGrid}>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{data.resumo.total_alunos}</span>
            <span className={styles.description}>alunos</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{data.resumo.total_grupos}</span>
            <span className={styles.description}>grupos</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{data.resumo.total_turmas}</span>
            <span className={styles.description}>turmas</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Médias de Impacto</h3>
        <div className={styles.compactGrid}>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{formatWeight(data.resumo.media_kg_aluno)}</span>
            <span className={styles.description}>por aluno</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{formatWeight(data.resumo.media_kg_grupo)}</span>
            <span className={styles.description}>por grupo</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.mainValue}>{formatWeight(data.resumo.media_kg_turma)}</span>
            <span className={styles.description}>por turma</span>
          </div>
        </div>
      </div>
    </div>
  );
}
