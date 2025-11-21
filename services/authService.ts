/**
 * Authentication API Service
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
}

export const login = async (credentials: LoginCredentials): Promise<AdminUser> => {
  const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include' // Important for session cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return data.user;
};

export const logout = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth.php?action=logout`, {
    method: 'POST',
    credentials: 'include'
  });
};

export const verifySession = async (): Promise<{ authenticated: boolean; user?: AdminUser }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=verify`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { authenticated: false };
    }
    
    return await response.json();
  } catch (err) {
    return { authenticated: false };
  }
};
