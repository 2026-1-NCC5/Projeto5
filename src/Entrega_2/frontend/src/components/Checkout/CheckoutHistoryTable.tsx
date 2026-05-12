import { CheckoutSession } from '@/types';
import styles from './CheckoutHistoryTable.module.css';

interface CheckoutHistoryTableProps {
  sessions: CheckoutSession[];
}

export function CheckoutHistoryTable({ sessions }: CheckoutHistoryTableProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Histórico de Conferências</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sessão ID</th>
              <th>Data e Hora</th>
              <th className={styles.center}>Total de Itens</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <tr key={session.id}>
                  <td className={styles.sessionId}>{session.id}</td>
                  <td>{new Date(session.data || (session as any).data_criacao).toLocaleString('pt-BR')}</td>
                  <td className={styles.center}>{session.total_itens}</td>
                  <td>{session.responsavel?.nome || 'Administrador'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.empty}>Nenhuma conferência realizada ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
