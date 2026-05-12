'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const successMessage = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(identifier, password);
      
      // Redireciona para os projetos do usuário logado
      router.push(callbackUrl || `/${data.user.username}/projetos`);
      router.refresh(); 
    } catch (error: any) {
      // O erro já é capturado pelo hook useAuth
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Bem-vindo</h1>
          <p>Acesse o ScanCount AI</p>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">E-mail, Usuário ou Telefone</label>
            <input 
              type="text" 
              id="identifier" 
              placeholder="seu@email.com ou username" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          Ainda não tem conta? <Link href={`/cadastro${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}>Cadastre-se</Link>
        </div>
      </div>
    </main>
  );
}