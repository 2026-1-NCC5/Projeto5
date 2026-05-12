import { useState, useCallback } from 'react';
import { apiFetch } from '@/services/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Login no formato OAuth2 (x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('username', emailOrUsername); // O FastAPI espera 'username'
      formData.append('password', password);

      const res = await apiFetch('auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        throw new Error('Falha no login. Verifique suas credenciais.');
      }

      const tokenData = await res.json();
      localStorage.setItem('token', tokenData.access_token);
      document.cookie = `token=${tokenData.access_token}; path=/; max-age=3600; SameSite=Lax`;

      // 2. Buscar dados do usuário (ID, Username) já que o login só retorna o token
      const userRes = await apiFetch('/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (userRes.ok && userRes.headers.get('content-type')?.includes('application/json')) {
        const userData = await userRes.json();
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `user_id=${userData.id}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `username=${userData.username}; path=/; max-age=3600; SameSite=Lax`;
        return { ...tokenData, user: userData };
      }

      return tokenData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  }, [router]);

  const register = useCallback(async (dados: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // MAPEAMENTO: O backend espera 'senha', o frontend usa 'password'
      const payload = {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        username: dados.username,
        email: dados.email,
        celular: dados.celular,
        senha: dados.password, // Aqui está a correção!
        role: 'admin'
      };

      const res = await apiFetch('usuarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Falha ao criar conta.');
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (dados: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Falha ao atualizar perfil.' }));
        throw new Error(errorData.detail || 'Falha ao atualizar perfil.');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile
  };
}
