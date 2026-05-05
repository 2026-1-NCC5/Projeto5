import React from 'react';
import styles from './ItemsList.module.css';
import { ExtendedColetaItem } from '@/hooks/useCheckoutAI';

interface ItemsListProps {
  itens: ExtendedColetaItem[];
  handleCancel: () => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({ itens, handleCancel }) => {
  const summaryByItem = itens.reduce((acc, item) => {
    if (!acc[item.nome]) {
      acc[item.nome] = { qtd: 0, pesoTotal: 0, precoTotal: 0 };
    }
    acc[item.nome].qtd += 1;
    acc[item.nome].pesoTotal += item.peso;
    acc[item.nome].precoTotal += item.preco;
    return acc;
  }, {} as Record<string, { qtd: number; pesoTotal: number; precoTotal: number }>);

  const totalQtd = itens.length;
  const totalPeso = itens.reduce((acc, item) => acc + item.peso, 0);
  const totalPreco = itens.reduce((acc, item) => acc + item.preco, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Itens no Checkout</h3>
        <button className={styles.clearBtn} onClick={handleCancel}>Limpar</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Peso</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summaryByItem).map(([nome, data]) => (
              <tr key={nome}>
                <td>{nome}</td>
                <td>{data.qtd}x</td>
                <td>{data.pesoTotal.toFixed(2)} kg</td>
                <td>R$ {data.precoTotal.toFixed(2)}</td>
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

      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span>Itens Totais</span>
          <strong>{totalQtd}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Peso Total</span>
          <strong>{totalPeso.toFixed(2)} kg</strong>
        </div>
        <div className={`${styles.summaryItem} ${styles.total}`}>
          <span>Subtotal</span>
          <strong>R$ {totalPreco.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};
