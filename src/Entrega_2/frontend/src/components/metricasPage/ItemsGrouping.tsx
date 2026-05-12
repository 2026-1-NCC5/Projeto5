import { MetricasDashboard } from '@/types';
import styles from './ItemsGrouping.module.css';

interface ItemsGroupingProps {
  data: MetricasDashboard;
}

export function ItemsGrouping({ data }: ItemsGroupingProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Total de Quilos por Tipo de Item</h3>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tipo de Item</th>
              <th>Total Arrecadado (kg)</th>
              <th className={styles.barHeader}>Proporção</th>
            </tr>
          </thead>
          <tbody>
            {(data.distribuicao || []).map((item, index) => {
              const maxKilos = Math.max(...(data.distribuicao || []).map(i => i.quantidade_kg), 1);
              const proportion = (item.quantidade_kg / maxKilos) * 100;
              
              return (
                <tr key={index}>
                  <td className={styles.itemName}>{item.item_nome}</td>
                  <td className={styles.itemValue}>{item.quantidade_kg.toFixed(2)} kg</td>
                  <td className={styles.percentCell}>
                    {proportion.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className={styles.footerLabel}>Total Geral:</td>
              <td colSpan={2} className={styles.footerValue}>
                {(data.distribuicao || []).reduce((acc, curr) => acc + curr.quantidade_kg, 0).toFixed(2)} kg
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
