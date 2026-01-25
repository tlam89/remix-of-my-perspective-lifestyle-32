// ============================================================================
// AUTH SERVICE - External API Communication
// ============================================================================

let accessToken: string | null = null;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const apiFetch = async (
  endpoint: string,
  init: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...init.headers,
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
  });

  if (res.status === 401 && !endpoint.includes('/auth/')) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refresh.ok) {
      clearAccessToken();
      throw new Error('Session expired');
    }

    const data = await refresh.json();
    setAccessToken(data.accessToken);

    return apiFetch(endpoint, init);
  }

  return res;
};

export const authService = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Login failed', user: null };
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    return { success: true, error: null, user: data.user };
  },

  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAccessToken();
    }
  },

  async refreshSession() {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        return { success: true, user: data.user };
      }
      return { success: false, user: null };
    } catch (err) {
      console.error('Session refresh failed:', err);
      return { success: false, user: null };
    }
  },
};
