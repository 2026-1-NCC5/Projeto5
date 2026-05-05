import React from 'react';
import styles from './ItemsSummary.module.css';
import { ExtendedColetaItem } from '@/hooks/useCheckoutAI';

interface ItemsSummaryProps {
  itens: ExtendedColetaItem[];
}

export const ItemsSummary: React.FC<ItemsSummaryProps> = ({ itens }) => {
  const summaryByItem = itens.reduce((acc, item) => {
    if (!acc[item.nome]) {
      acc[item.nome] = { qtd: 0, pesoTotal: 0, precoTotal: 0, confTotal: 0 };
    }
    acc[item.nome].qtd += 1;
    acc[item.nome].pesoTotal += item.peso;
    acc[item.nome].precoTotal += item.preco;
    acc[item.nome].confTotal += item.grau_de_confianca;
    return acc;
  }, {} as Record<string, { qtd: number; pesoTotal: number; precoTotal: number; confTotal: number }>);

  const totalPreco = itens.reduce((acc, item) => acc + item.preco, 0);
  const totalPeso = itens.reduce((acc, item) => acc + item.peso, 0);
  const avgGlobalConf = itens.length > 0 
    ? itens.reduce((acc, item) => acc + item.grau_de_confianca, 0) / itens.length 
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Síntese de Compra</h3>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colName}>Nome</th>
              <th className={styles.colWeight}>Peso</th>
              <th className={styles.colPrice}>Preço</th>
              <th className={styles.colConf}>Conf. Média</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summaryByItem).map(([nome, data]) => {
              const avgConf = data.confTotal / data.qtd;
              return (
                <tr key={nome}>
                  <td className={styles.cellName}>
                    <span className={styles.qtdBadge}>{data.qtd}x</span>
                    {nome}
                  </td>
                  <td className={styles.cellWeight}>{data.pesoTotal.toFixed(2)}kg</td>
                  <td className={styles.cellPrice}>R$ {data.precoTotal.toFixed(2)}</td>
                  <td className={styles.cellConf}>
                    <div className={`${styles.confBox} ${
                      avgConf >= 0.8 ? styles.high : 
                      avgConf >= 0.7 ? styles.medium : styles.low
                    }`}>
                      <span className={styles.confValue}>{Math.round(avgConf * 100)}%</span>
                      <div className={styles.miniBar}>
                        <div className={styles.fill} style={{ width: `${avgConf * 100}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {itens.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.empty}>Aguardando itens...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColName}>
            <span>TOTAL GERAL</span>
          </div>
          <div className={styles.footerColWeight}>
            <strong>{totalPeso.toFixed(2)}kg</strong>
          </div>
          <div className={styles.footerColPrice}>
            <strong className={styles.totalValue}>R$ {totalPreco.toFixed(2)}</strong>
          </div>
          <div className={styles.footerColConf}>
            <div className={`${styles.globalConf} ${
              avgGlobalConf >= 0.8 ? styles.high : 
              avgGlobalConf >= 0.7 ? styles.medium : styles.low
            }`}>
              <span>{Math.round(avgGlobalConf * 100)}%</span>
              <small>Média</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
