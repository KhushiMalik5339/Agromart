import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/axios';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const initialRole = (searchParams.get('role') as 'customer' | 'farmer') || 'customer';
  const [role, setRole] = useState<'customer' | 'farmer'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        phone: phone || undefined,
        farm_name: role === 'farmer' ? farmName : undefined,
        farm_location: role === 'farmer' ? farmLocation : undefined,
      });

      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);

      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-xl w-full bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-outline-variant/40 card-elevation-2 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary font-bold text-2xl mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl">local_florist</span>
          </div>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-on-surface">Join the AgroMart Community</h2>
          <p className="text-sm text-on-surface-variant">Direct farm-to-table access or sell certified organic produce.</p>
        </div>

        {/* Role Toggle */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex items-center gap-2 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'customer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">shopping_cart</span>
            I Want to Buy Organic
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'farmer'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">agriculture</span>
            I Am an Organic Farmer
          </button>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container text-xs p-3 rounded-xl font-medium border border-error/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Patel"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh@patelorganics.com"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Conditional Farmer Fields */}
          {role === 'farmer' && (
            <div className="p-4 bg-secondary-container/20 rounded-2xl border border-secondary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">agriculture</span>
                Organic Farm Certification Details
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                  Farm Name
                </label>
                <input
                  type="text"
                  required={role === 'farmer'}
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Green Valley Bio Farm"
                  className="w-full bg-white border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                  Farm Location / Address
                </label>
                <input
                  type="text"
                  required={role === 'farmer'}
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="Pampore, Kashmir / Nashik, Maharashtra"
                  className="w-full bg-white border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 ${
              role === 'farmer'
                ? 'bg-secondary hover:bg-secondary-container text-on-secondary'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register as {role === 'farmer' ? 'Organic Farmer' : 'Customer'}</span>
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};
