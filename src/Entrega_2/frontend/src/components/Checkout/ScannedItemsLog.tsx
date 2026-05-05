import React from 'react';
import styles from './ScannedItemsLog.module.css';
import { ExtendedColetaItem } from '@/hooks/useCheckoutAI';

interface ScannedItemsLogProps {
  itens: ExtendedColetaItem[];
}

export const ScannedItemsLog: React.FC<ScannedItemsLogProps> = ({ itens }) => {
  const reversedItens = [...itens].reverse();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Fluxo de Passagem</h3>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colName}>Nome</th>
              <th className={styles.colWeight}>Peso</th>
              <th className={styles.colPrice}>Preço</th>
              <th className={styles.colConf}>Conf.</th>
            </tr>
          </thead>
          <tbody>
            {reversedItens.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td className={styles.cellName}>
                  <span className={styles.dot} />
                  {item.nome}
                </td>
                <td className={styles.cellWeight}>{item.peso.toFixed(2)}kg</td>
                <td className={styles.cellPrice}>R$ {item.preco.toFixed(2)}</td>
                <td className={styles.cellConf}>
                  <span className={`${styles.confText} ${
                    item.grau_de_confianca >= 0.8 ? styles.high : 
                    item.grau_de_confianca >= 0.7 ? styles.medium : styles.low
                  }`}>
                    {(item.grau_de_confianca * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.empty}>Aguardando detecção...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
