const API_URL = 'http://127.0.0.1:8000/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.replace(/^\/?api\//, '').replace(/^\//, '');
  const url = `${API_URL}/${cleanPath}`;

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  let token = getCookie('token');
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
    signal: AbortSignal.timeout(15000),
  });

  const isCriticalRoute = cleanPath.includes('auth/login') || cleanPath.includes('auth/me');

  if (response.status === 401 && !isCriticalRoute) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  return response;
}
