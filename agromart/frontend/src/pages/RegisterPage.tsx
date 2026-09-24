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

  // Farmer specific fields (TASK 5)
  const [farmName, setFarmName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [farmCategory, setFarmCategory] = useState('Vegetables');
  const [farmingType, setFarmingType] = useState('100% Certified Organic (NPOP)');
  const [verificationDetails, setVerificationDetails] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone: phone || undefined,
      };

      if (role === 'farmer') {
        payload.farm_name = farmName;
        payload.village = village;
        payload.district = district;
        payload.state = state;
        payload.category = farmCategory;
        payload.farming_type = farmingType;
        payload.verification_details = verificationDetails || 'Self-Declared Organic Farm';
      }

      const res = await api.post('/auth/register', payload);

      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);

      if (user.role === 'farmer') {
        setSuccessMsg('Farm registered! Your account is submitted for Admin Approval.');
        setTimeout(() => navigate('/farmer/dashboard'), 1500);
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

        {successMsg && (
          <div className="bg-green-100 text-green-800 text-xs p-3 rounded-xl font-semibold border border-green-300">
            {successMsg}
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
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Conditional Farmer Fields (TASK 5) */}
          {role === 'farmer' && (
            <div className="p-4 sm:p-5 bg-secondary-container/20 rounded-2xl border border-secondary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-secondary uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">agriculture</span>
                  Farmer & Farm Details
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Requires Admin Approval
                </span>
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
                  className="w-full bg-white border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Village / City
                  </label>
                  <input
                    type="text"
                    required={role === 'farmer'}
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Panchavati"
                    className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    District
                  </label>
                  <input
                    type="text"
                    required={role === 'farmer'}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Nashik"
                    className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    required={role === 'farmer'}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Farm/Product Category
                  </label>
                  <select
                    value={farmCategory}
                    onChange={(e) => setFarmCategory(e.target.value)}
                    className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Spices">Spices</option>
                    <option value="Other Agricultural Products">Other Agricultural Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Farming Type
                  </label>
                  <select
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                    className="w-full bg-white border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="100% Certified Organic (NPOP)">100% Certified Organic (NPOP)</option>
                    <option value="Natural / Vedic Farming (ZBNF)">Natural / Vedic Farming (ZBNF)</option>
                    <option value="Hydroponic Clean Produce">Hydroponic Clean Produce</option>
                    <option value="Permaculture / Agroforestry">Permaculture / Agroforestry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                  Basic Verification Details
                </label>
                <input
                  type="text"
                  value={verificationDetails}
                  onChange={(e) => setVerificationDetails(e.target.value)}
                  placeholder="Organic Certification No. / Land Record / Kisan Credit ID"
                  className="w-full bg-white border border-outline-variant/60 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
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
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
