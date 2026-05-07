import { useState } from 'react';
import { Grupo, Coleta, Aluno } from '@/types';
import styles from './GroupRow.module.css';

interface GroupRowProps {
  grupo: Grupo;
}

export function GroupRow({ grupo }: GroupRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr 
        className={`${styles.row} ${isExpanded ? styles.expandedRow : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className={styles.expandCell}>
          <span className={`material-symbols-outlined ${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`}>
            chevron_right
          </span>
        </td>
        <td className={styles.cell}>
          <span className={styles.grupoName}>{grupo.nome}</span>
        </td>
        <td className={styles.cell}>
          <div className={styles.badge}>
            {grupo.alunos.length} {grupo.alunos.length === 1 ? 'Membro' : 'Membros'}
          </div>
        </td>
        <td className={styles.cell}>
          {(grupo.pesoTotal || 0).toFixed(2)} kg
        </td>
        <td className={styles.cell}>
          R$ {(grupo.precoTotal || 0).toFixed(2)}
        </td>
      </tr>

      {isExpanded && (
        <tr className={styles.detailsRow}>
          <td colSpan={5} className={styles.detailsCell}>
            <div className={styles.detailsContainer}>
              <div className={styles.detailsSection}>
                <h4 className={styles.sectionTitle}>Integrantes do Grupo</h4>
                {grupo.alunos.length > 0 ? (
                  <ul className={styles.memberList}>
                    {grupo.alunos.map((aluno: Aluno) => (
                      <li key={aluno.id} className={styles.memberItem}>
                        <span className={styles.memberName}>{aluno.nome}</span>
                        <span className={styles.memberRa}>RA: {aluno.ra}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyText}>Nenhum membro neste grupo.</p>
                )}
              </div>

              <div className={styles.detailsSection}>
                <h4 className={styles.sectionTitle}>Histórico de Coletas</h4>
                {grupo.coletas && grupo.coletas.length > 0 ? (
                  <div className={styles.historyTableWrapper}>
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Tipo</th>
                          <th>Qtd. Itens</th>
                          <th>Peso Total</th>
                          <th>Valor Aprox.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupo.coletas.map((coleta: Coleta) => (
                          <tr key={coleta.id}>
                            <td>{new Date(coleta.dataHora).toLocaleDateString('pt-BR')}</td>
                            <td>Itens</td>
                            <td>{coleta.itens ? coleta.itens.length : 0}</td>
                            <td>{coleta.pesoTotal.toFixed(2)} kg</td>
                            <td>R$ {coleta.precoTotal.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2} className={styles.footerLabel}>Totais do Histórico:</td>
                          <td>
                            {grupo.coletas.reduce((acc, c) => acc + (c.itens ? c.itens.length : 0), 0)}
                          </td>
                          <td>
                            {grupo.coletas.reduce((acc, c) => acc + c.pesoTotal, 0).toFixed(2)} kg
                          </td>
                          <td>
                            R$ {grupo.coletas.reduce((acc, c) => acc + c.precoTotal, 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className={styles.emptyText}>Nenhum registro de coleta encontrado.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
