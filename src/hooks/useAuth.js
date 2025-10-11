import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie, removeAuthCookie, isAuthenticated } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // You could fetch user details here if needed
        setUser({ authenticated: true });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      removeAuthCookie();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove local auth state even if API call fails
      removeAuthCookie();
      setUser(null);
      router.push('/');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};
