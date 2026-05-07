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
            {data.kilosPorItem.map((item, index) => {
              const maxKilos = Math.max(...data.kilosPorItem.map(i => i.quilos));
              const proportion = (item.quilos / maxKilos) * 100;
              
              return (
                <tr key={index}>
                  <td className={styles.itemName}>{item.nome}</td>
                  <td className={styles.itemValue}>{item.quilos.toFixed(2)} kg</td>
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
                {data.kilosPorItem.reduce((acc, curr) => acc + curr.quilos, 0).toFixed(2)} kg
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
