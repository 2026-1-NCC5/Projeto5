'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function CadastroPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para chamar o endpoint POST /usuarios/ do seu backend FastAPI
    console.log("Tentativa de cadastro");
  };

  return (
    <main className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1>Criar Conta</h1>
          <p>Junte-se ao ScanCount AI</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome</label>
            <input 
              type="text" 
              id="nome" 
              placeholder="Fulano(a)" 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="sobrenome">Sobrenome</label>
            <input 
              type="text" 
              id="sobrenome" 
              placeholder="de Tal" 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              placeholder="seu@email.com" 
              required 
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Finalizar Cadastro
          </button>
        </form>

        <div className={styles.footer}>
          Já possui uma conta? <Link href="/login">Entre aqui</Link>
        </div>
      </div>
    </main>
  );
}