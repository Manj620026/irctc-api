export const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';

export function getAuthToken(): string | null {
  return localStorage.getItem('irctc_api_token');
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}
