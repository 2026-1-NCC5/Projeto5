import { CheckoutItemSynthesis } from '@/types';
import styles from './SynthesisTable.module.css';

interface SynthesisTableProps {
  data: CheckoutItemSynthesis[];
}

export function SynthesisTable({ data }: SynthesisTableProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Síntese da Edição</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th className={styles.center}>Meta (Alunos)</th>
              <th className={styles.center}>Realizado (Edição)</th>
              <th>Progresso</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, idx) => {
              const progress = Math.min(Math.round((item.realizado_edicao / item.meta_alunos) * 100), 100);
              return (
                <tr key={idx}>
                  <td className={styles.itemName}>{item.item_nome}</td>
                  <td className={styles.center}>{item.meta_alunos}</td>
                  <td className={styles.center}>{item.realizado_edicao}</td>
                  <td>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>{progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
