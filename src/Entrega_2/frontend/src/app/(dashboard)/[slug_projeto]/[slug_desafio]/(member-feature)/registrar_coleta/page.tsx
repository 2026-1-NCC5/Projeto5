'use client';

import React, { useState, useMemo } from 'react';
import styles from './page.module.css';
import { mockItemsBase } from '@/mocks/list/item';
import { Item } from '@/types';
import { useParams } from 'next/navigation';

type TipoRegistro = 'itens' | 'dinheiro' | 'resgate';

interface ItemNoRegistro {
  item: Item;
  quantidade: number;
}

export default function RegistrarColetaPage() {
  const params = useParams();
  const [tipo, setTipo] = useState<TipoRegistro>('itens');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para Itens
  const [itensNoRegistro, setItensNoRegistro] = useState<ItemNoRegistro[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Estados para Dinheiro/Resgate
  const [valor, setValor] = useState<number>(0);

  // Lista flat de todos os itens disponíveis nos mocks
  const allAvailableItems = useMemo(() => {
    return Object.values(mockItemsBase).flatMap(cat => cat.variants);
  }, []);

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const item = allAvailableItems.find(i => i.id === selectedItemId);
    if (!item) return;

    setItensNoRegistro(prev => [...prev, { item, quantidade }]);
    setSelectedItemId('');
    setQuantidade(1);
  };

  const handleRemoveItem = (index: number) => {
    setItensNoRegistro(prev => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    return itensNoRegistro.reduce((acc, current) => {
      acc.peso += current.item.peso * current.quantidade;
      acc.valor += current.item.preco * current.quantidade;
      return acc;
    }, { peso: 0, valor: 0 });
  }, [itensNoRegistro]);

  const handleFinish = async () => {
    // Validações
    if (tipo === 'itens' && itensNoRegistro.length === 0) {
      alert('Adicione pelo menos um item!');
      return;
    }
    if ((tipo === 'dinheiro' || tipo === 'resgate') && valor <= 0) {
      alert('Insira um valor válido!');
      return;
    }

    const confirmMsg = tipo === 'resgate' 
      ? `Confirmar resgate de R$ ${valor.toFixed(2)}?`
      : 'Deseja finalizar este registro?';

    if (!confirm(confirmMsg)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        tipo,
        data: new Date().toISOString(),
        projetoSlug: params.slug_projeto,
        desafioSlug: params.slug_desafio,
        // Dados específicos por tipo
        itens: tipo === 'itens' ? itensNoRegistro.map(i => ({ id: i.item.id, qtd: i.quantidade })) : null,
        valor: (tipo === 'dinheiro' || tipo === 'resgate') ? valor : null,
      };

      const res = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Registro realizado com sucesso!');
        // Reset estados
        setItensNoRegistro([]);
        setValor(0);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar registro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1>Registrar Coleta</h1>
          <p>Selecione o tipo de registro e preencha os dados abaixo</p>
        </div>
        <button 
          className={styles.finishBtn}
          onClick={handleFinish}
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined">check_circle</span>
          {isSubmitting ? 'Processando...' : 'Finalizar Registro'}
        </button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${tipo === 'itens' ? styles.active : ''}`}
          onClick={() => setTipo('itens')}
        >
          <span className="material-symbols-outlined">inventory_2</span>
          Itens Coletados
        </button>
        <button 
          className={`${styles.tabBtn} ${tipo === 'dinheiro' ? styles.active : ''}`}
          onClick={() => setTipo('dinheiro')}
        >
          <span className="material-symbols-outlined">payments</span>
          Dinheiro
        </button>
        <button 
          className={`${styles.tabBtn} ${tipo === 'resgate' ? styles.active : ''}`}
          onClick={() => setTipo('resgate')}
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          Resgate
        </button>
      </div>

      <section className={styles.contentCard}>
        {tipo === 'itens' && (
          <div className={styles.itensSection}>
            <div className={styles.addItemRow}>
              <div className={styles.inputGroup}>
                <label>Produto</label>
                <select 
                  className={styles.select}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">Selecione um item...</option>
                  {allAvailableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nome} (Ref: {item.peso}kg)
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Quantidade</label>
                <input 
                  type="number" 
                  className={styles.input}
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                />
              </div>
              <button className={styles.addBtn} onClick={handleAddItem}>
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.itemTable}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Peso Unit.</th>
                    <th>Qtd</th>
                    <th>Peso Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itensNoRegistro.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className={styles.emptyState}>
                          <span className="material-symbols-outlined">shopping_cart_off</span>
                          Nenhum item adicionado à lista.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    itensNoRegistro.map((reg, index) => (
                      <tr key={index}>
                        <td>{reg.item.nome}</td>
                        <td>{reg.item.peso.toFixed(2)} kg</td>
                        <td>{reg.quantidade}x</td>
                        <td>{(reg.item.peso * reg.quantidade).toFixed(2)} kg</td>
                        <td>
                          <button className={styles.removeBtn} onClick={() => handleRemoveItem(index)}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Itens</span>
                <span className={styles.summaryValue}>{itensNoRegistro.length}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Peso Total</span>
                <span className={styles.summaryValue}>{totals.peso.toFixed(2)} kg</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Valor Estimado</span>
                <span className={styles.summaryValue}>R$ {totals.valor.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {(tipo === 'dinheiro' || tipo === 'resgate') && (
          <div className={styles.moneyInputWrapper}>
            <h2>
              {tipo === 'dinheiro' ? 'Registrar Valor Arrecadado' : 'Declarar Valor para Resgate'}
            </h2>
            <p>
              {tipo === 'dinheiro' 
                ? 'Informe o valor em dinheiro que será adicionado à carteira do grupo.'
                : 'O valor informado será subtraído do saldo disponível do grupo.'}
            </p>
            <div className={styles.currencyInputContainer}>
              <span className={styles.currencySymbol}>R$</span>
              <input 
                type="number"
                step="0.01"
                className={styles.bigInput}
                placeholder="0,00"
                value={valor || ''}
                onChange={(e) => setValor(Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
