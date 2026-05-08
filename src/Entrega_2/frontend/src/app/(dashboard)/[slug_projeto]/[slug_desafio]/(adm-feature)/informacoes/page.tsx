'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { Desafio, Item } from '@/types';
import { ItemPermissionManager } from '@/components/ProjectInfo/ItemPermissionManager';
import styles from './page.module.css';

export default function InfoEdicaoPage() {
  const { desafio, isLoading: projectLoading } = useProject();
  const { slug_projeto, slug_desafio } = useParams();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [itensPermitidos, setItensPermitidos] = useState<string[]>([]);
  const [catalogoItens, setCatalogoItens] = useState<Item[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados iniciais do contexto
  useEffect(() => {
    if (desafio) {
      setNome(desafio.nome);
      setDataInicio(desafio.dataInicio);
      setDataFim(desafio.dataFim);
      setItensPermitidos(desafio.itensPermitidos || []);
    }
  }, [desafio]);

  // Carrega catálogo de itens
  useEffect(() => {
    fetch('/api/itens/catalogo')
      .then(res => res.json())
      .then(data => setCatalogoItens(data))
      .catch(err => console.error('Erro ao buscar catálogo:', err));
  }, []);

  const handleAddManualItem = async (itemData: Omit<Item, 'id'>) => {
    try {
      const res = await fetch('/api/itens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      
      if (res.ok) {
        const newItem = await res.json();
        // Adiciona ao catálogo local e aos permitidos
        setCatalogoItens([...catalogoItens, newItem]);
        setItensPermitidos([...itensPermitidos, newItem.id.toString()]);
      }
    } catch (error) {
      console.error('Erro ao criar item manual:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updateData: Partial<Desafio> = {
      nome,
      dataInicio,
      dataFim,
      itensPermitidos
    };

    try {
      const response = await fetch(`/api/projetos/${slug_projeto}/desafios/${slug_desafio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('Edição atualizada com sucesso!');
        const updated = await response.json();
        if (updated.slug !== slug_desafio) {
          router.replace(`/${slug_projeto}/${updated.slug}/informacoes`);
        }
      } else {
        alert('Erro ao atualizar edição.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (projectLoading) {
    return <div className={styles.loading}>Carregando informações da edição...</div>;
  }

  if (projeto?.papel !== 'adm') {
    return null; // O ProjectContext cuidará do redirecionamento
  }

  if (!desafio) {
    return <div className={styles.error}>Edição não encontrada.</div>;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Configurações da Edição</h1>
        <p className={styles.subtitle}>Gerencie o cronograma e os itens válidos para esta etapa.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cronograma</h2>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome da Edição</label>
              <input 
                id="nome"
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="inicio">Data de Início</label>
              <input 
                id="inicio"
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="fim">Data de Encerramento</label>
              <input 
                id="fim"
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Itens Permitidos</h2>
          <p className={styles.sectionDesc}>
            Busque itens no sistema ou crie novos para permitir o registro nesta edição.
          </p>
          
          <ItemPermissionManager 
            itensPermitidosIds={itensPermitidos}
            catalogoItens={catalogoItens}
            onToggle={(id) => {
              if (itensPermitidos.includes(id)) {
                setItensPermitidos(itensPermitidos.filter(i => i !== id));
              } else {
                setItensPermitidos([...itensPermitidos, id]);
              }
            }}
            onAddManual={handleAddManualItem}
          />
        </section>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </main>
  );
}
