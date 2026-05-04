'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Projeto } from '@/types'; // Importando sua interface centralizada
import styles from './page.module.css';

export default function NovoProjetoPage() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Projeto Social Estudantil');
  
  // Estado para controlar o loading e desabilitar o botão
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  // Função para gerar o slug automaticamente (boa prática para a URL amigável)
  const gerarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inicia o estado de envio e inativa o botão
    setIsSubmitting(true);

    const novoProjeto = {
      nome,
      slug: gerarSlug(nome),
      tipo,
      // O restante dos campos (id, imagem, data) o MSW ou o Backend completa
    };

    try {
      const response = await fetch('https://api.scancount.com/projetos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProjeto),
      });

      if (response.ok) {
        // Se o retorno for positivo, redireciona para a listagem
        // O router.push() envia para a página, e o refresh() garante que os dados novos apareçam
        router.push('/projetos');
        router.refresh(); 
      } else {
        alert('Erro ao criar o projeto. Tente novamente.');
        setIsSubmitting(false); // Libera o botão em caso de erro para o usuário tentar corrigir
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('Falha na comunicação com o servidor.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formCard}>
        <header className={styles.header}>
          <Link href="/projetos" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar
          </Link>
          <h1>Configurar Novo Projeto</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome da Organização</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isSubmitting} // Desabilita o input durante o envio
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="tipo">Categoria</label>
            <select
              id="tipo"
              className={styles.selectInput}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="Comercial">Comercial</option>
              <option value="Departamento de Empresa">Departamento de Empresa</option>
              <option value="Projeto Social">Projeto Social</option>
              <option value="Projeto Social Estudantil">Projeto Social Estudantil</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSubmitting || !nome} // Botão desabilitado se estiver enviando ou se o nome estiver vazio
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}