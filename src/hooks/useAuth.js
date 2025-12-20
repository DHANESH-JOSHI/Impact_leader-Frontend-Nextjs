import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie, removeAuthCookie, isAuthenticated } from '@/lib/auth';
import { AuthService } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
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
      const result = await AuthService.login(email, password);

      if (result.success) {
        setUser(result.user);
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      removeAuthCookie();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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
