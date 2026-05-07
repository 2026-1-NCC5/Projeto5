'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/projetos';

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 1. Salva no localStorage para uso interno do frontend[cite: 9]
        localStorage.setItem('token', data.access_token);
        
        // 2. SALVA NOS COOKIES - Essencial para o Middleware e Mocks funcionarem
        // O "path=/" torna o cookie acessível em todo o site
        document.cookie = `token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `user_id=${data.userId}; path=/; max-age=3600; SameSite=Lax`;

        // 3. Redireciona
        router.push(callbackUrl);
        
        // Dica: Se ainda assim travar, use router.refresh() para forçar o Next.js 
        // a ler o novo cookie imediatamente no Middleware
        router.refresh(); 
      } else {
        alert("Erro nas credenciais (Simulado)");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>ScanCount AI</h1>
          <p>Gestão Inteligente de Inventário</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Verificando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className={styles.footer}>
          Não tem uma conta? <Link href={`/cadastro${callbackUrl !== '/projetos' ? `?callbackUrl=${callbackUrl}` : ''}`}>Cadastre-se</Link>
        </div>
      </div>
    </main>
  );
}