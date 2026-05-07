import { Aluno } from '@/types';
import { StudentRow } from './StudentRow';
import styles from './StudentTable.module.css';

interface StudentTableProps {
  alunos: Aluno[];
  onUpdate: (id: string | number, data: Partial<Aluno>) => void;
  onDelete: (id: string | number) => void;
}

export function StudentTable({ alunos, onUpdate, onDelete }: StudentTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>RA</th>
            <th>Email</th>
            <th>Grupo</th>
            <th>Vinculado</th>
            <th className={styles.actionsHeader}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <StudentRow 
                key={aluno.id} 
                aluno={aluno} 
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.emptyCell}>
                Nenhum aluno encontrado para os critérios de busca.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
