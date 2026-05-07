import { Grupo } from '@/types';
import { GroupRow } from './GroupRow';
import styles from './GroupTable.module.css';

interface GroupTableProps {
  grupos: Grupo[];
}

export function GroupTable({ grupos }: GroupTableProps) {
  if (grupos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum grupo encontrado.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.expandHeader}></th>
            <th>Nome do Grupo</th>
            <th>Membros</th>
            <th>Peso Total</th>
            <th>Valor Total Aprox.</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map(grupo => (
            <GroupRow key={grupo.id} grupo={grupo} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
