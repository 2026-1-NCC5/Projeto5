'use client';

import React, { useMemo, useState } from 'react';
import styles from './HistoryCard.module.css';

interface RegistroDetalhe {
  nome: string;
  qtd: number;
  peso: number;
  valor: number;
}

interface RegistroHistory {
  id: number;
  data: string;
  tipo: 'itens' | 'dinheiro' | 'resgate';
  aluno: { nome: string };
  grupo: { nome: string };
  total_peso: number;
  total_valor: number;
  detalhes?: RegistroDetalhe[];
}

interface HistoryCardProps {
  historico: RegistroHistory[];
  grupoNome: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ historico, grupoNome }) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const totalGrupo = useMemo(() => {
    return historico.reduce((acc, curr) => {
      acc.peso += curr.total_peso || 0;
      acc.valor += curr.total_valor || 0;
      return acc;
    }, { peso: 0, valor: 0 });
  }, [historico]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>
          <span className="material-symbols-outlined">history</span>
          Histórico do Grupo {grupoNome}
        </h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Aluno</th>
              <th>Peso</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {historico.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              historico.map((reg) => (
                <React.Fragment key={reg.id}>
                  <tr 
                    className={`${styles.row} ${reg.tipo === 'itens' ? styles.expandableRow : ''}`}
                    onClick={() => reg.tipo === 'itens' && toggleRow(reg.id)}
                  >
                    <td>
                      {reg.tipo === 'itens' && (
                        <span className={`material-symbols-outlined ${styles.expandIcon} ${expandedRows[reg.id] ? styles.rotated : ''}`}>
                          expand_more
                        </span>
                      )}
                    </td>
                    <td>{new Date(reg.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        reg.tipo === 'itens' ? styles.badgeItens : 
                        reg.tipo === 'dinheiro' ? styles.badgeDinheiro : 
                        styles.badgeResgate
                      }`}>
                        {reg.tipo}
                      </span>
                    </td>
                    <td>{reg.aluno.nome}</td>
                    <td>{reg.total_peso > 0 ? `${reg.total_peso.toFixed(1)} kg` : '-'}</td>
                    <td>
                      <span style={{ color: reg.total_valor < 0 ? '#ef4444' : '#22c55e' }}>
                        R$ {Math.abs(reg.total_valor).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                  
                  {/* Detalhes Expandidos */}
                  {reg.tipo === 'itens' && expandedRows[reg.id] && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={6}>
                        <div className={styles.detailsContainer}>
                          <div className={styles.detailsList}>
                            {reg.detalhes?.map((det, i) => (
                              <div key={i} className={styles.detailItem}>
                                <span className={styles.detailName}>{det.nome}</span>
                                <span className={styles.detailQtd}>{det.qtd}x</span>
                                <span className={styles.detailInfo}>
                                  {det.peso.toFixed(1)}kg | R$ {det.valor.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.historySummary}>
        <div className={styles.summaryBox}>
          <span className={styles.summaryLabel}>Total Arrecadado (Kg)</span>
          <span className={styles.summaryValue}>{totalGrupo.peso.toFixed(1)} kg</span>
        </div>
        <div className={styles.summaryBox}>
          <span className={styles.summaryLabel}>Saldo da Carteira</span>
          <span className={`${styles.summaryValue} ${totalGrupo.valor < 0 ? styles.negative : ''}`}>
            R$ {totalGrupo.valor.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
};
