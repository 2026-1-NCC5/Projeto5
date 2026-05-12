const REAL_API_URL = 'http://127.0.0.1:8000/api'; 
const MOCK_API_PREFIX = '/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  // Remove '/api/' ou 'api/' do início para não duplicar com o REAL_API_URL
  const cleanPath = path.replace(/^\/?api\//, '').replace(/^\//, '');
  
  try {
    const url = `${REAL_API_URL}/${cleanPath}`;
    
    // Injeção Automática de Token
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    let token = getCookie('token');
    
    // Fallback para localStorage caso os cookies falhem (comum em desenvolvimento local)
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined;
    }

    const headers = new Headers(options.headers || {});
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      signal: AbortSignal.timeout(15000) 
    });
    
    // Para Login e Me, queremos sempre a resposta REAL do backend para evitar confusão com mocks
    const isCriticalRoute = cleanPath.includes('auth/login') || cleanPath.includes('auth/me');

    if (response.status === 401 && !isCriticalRoute) {
      console.warn('Sessão expirada (401). Limpando dados locais...');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }

    if (response.ok || [400, 401, 403].includes(response.status) || isCriticalRoute) {
      return response;
    }
    
    console.warn(`API Real (${cleanPath}) retornou status ${response.status}. Ativando simulador de desenvolvimento...`);
  } catch (error) {
    console.error(`[apiFetch] Erro ao conectar na API Real (${cleanPath}):`, error);
    console.info(`Usando simulação para: ${cleanPath}`);
  }

  // Fallback para o MSW (Mock Service Worker)
  return fetch(`${MOCK_API_PREFIX}/${cleanPath}`, options);
}
