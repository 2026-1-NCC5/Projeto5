'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useAuth } from '@/hooks/useAuth';

export default function CadastroPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl');
  const { register, isLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem.");
      return;
    }

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      await register(dataToSubmit);
      // Sucesso! Redireciona para o login
      router.push(`/login?message=Conta criada com sucesso!${callbackUrl ? `&callbackUrl=${callbackUrl}` : ''}`);
    } catch (err) {
      // Erro já é tratado pelo hook e exposto via authError
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1>Criar Conta</h1>
          <p>Junte-se ao ScanCount AI</p>
        </div>

        {(localError || authError) && (
          <div className={styles.errorMessage}>
            {localError || authError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome</label>
            <input 
              type="text" 
              id="nome" 
              placeholder="Fulano(a)" 
              value={formData.nome}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="sobrenome">Sobrenome</label>
            <input 
              type="text" 
              id="sobrenome" 
              placeholder="de Tal" 
              value={formData.sobrenome}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="seu_usuario" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              placeholder="seu@email.com" 
              value={formData.email}
              onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className={styles.footer}>
          Já possui uma conta? <Link href={`/login${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}>Entre aqui</Link>
        </div>
      </div>
    </main>
  );
}