import { Aluno } from '@/types';
import styles from './StudentsWithoutGroupTable.module.css';

interface StudentsWithoutGroupTableProps {
  alunos: Aluno[];
}

export function StudentsWithoutGroupTable({ alunos }: StudentsWithoutGroupTableProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Alunos sem Grupo</h2>
      <p className={styles.subtitle}>Estes alunos ainda não foram atribuídos a nenhum grupo nesta turma.</p>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>RA</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.ra}</td>
                <td>{aluno.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
