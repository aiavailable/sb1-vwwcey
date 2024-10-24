import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (email: string, password: string, redirectTo?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(redirectTo || '/');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);

  const handleSignup = useCallback(async (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await signup({ ...data, role: 'user' });
      navigate('/');
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  }, [signup, navigate]);

  return {
    isLoading,
    error,
    handleLogin,
    handleSignup
  };
}