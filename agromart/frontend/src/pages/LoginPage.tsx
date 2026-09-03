import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/axios';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [selectedRole, setSelectedRole] = useState<'customer' | 'farmer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);

      // Redirect based on role
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const res = await api.post('/auth/google', {
        id_token: 'mock_google_token_12345',
      });
      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);
      navigate('/home');
    } catch (err: any) {
      setError('Google Sign-In failed');
    }
  };

  const fillQuickDemo = (role: 'customer' | 'farmer' | 'admin') => {
    setSelectedRole(role);
    if (role === 'customer') {
      setEmail('customer@agromart.com');
      setPassword('password123');
    } else if (role === 'farmer') {
      setEmail('farmer@agromart.com');
      setPassword('password123');
    } else {
      setEmail('admin@agromart.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-outline-variant/40 card-elevation-2 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-2xl mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl">eco</span>
          </div>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-on-surface">Welcome Back</h2>
          <p className="text-sm text-on-surface-variant">Sign in to manage your organic orders & farm inventory.</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex items-center gap-1 border border-outline-variant/30">
          {(['customer', 'farmer', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => fillQuickDemo(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedRole === r
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Demo Credentials Quick Click */}
        <div className="bg-secondary-container/40 p-3 rounded-xl border border-secondary/20 text-xs text-on-secondary-container flex items-center justify-between">
          <span>Demo credentials auto-filled for <strong>{selectedRole}</strong></span>
          <span className="text-[10px] font-mono bg-white/60 px-2 py-0.5 rounded text-primary">password123</span>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container text-xs p-3 rounded-xl font-medium border border-error/30">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agromart.com"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline font-semibold">Forgot?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface-container-lowest px-3 text-on-surface-variant font-medium">
              Or Sign In With
            </span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/60 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-on-surface-variant pt-2">
          New to AgroMart?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Join the Community
          </Link>
        </p>

      </div>
    </div>
  );
};
