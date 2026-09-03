import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { Address } from '../types';

interface ProfileFormData {
  name: string;
  phone: string;
}

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({ label: 'Home', line1: '', city: '', state: '', pincode: '' });

  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileFormData>({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const { data: addresses, refetch: refetchAddresses } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/auth/addresses');
      return res.data;
    },
    enabled: activeTab === 'addresses',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await api.put('/auth/me', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/addresses', newAddr);
    },
    onSuccess: () => {
      setNewAddr({ label: 'Home', line1: '', city: '', state: '', pincode: '' });
      setShowAddAddress(false);
      refetchAddresses();
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/auth/addresses/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1">
        <img
          src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt={user?.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-primary shadow-md"
        />
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">{user?.name}</h1>
          <p className="text-sm text-on-surface-variant">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-semibold text-secondary bg-secondary-container/60 px-3 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-low rounded-2xl p-1.5 mb-6 border border-outline-variant/30">
        {(['profile', 'addresses', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/30'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSubmit((data) => updateProfileMutation.mutate(data))}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1 space-y-5"
        >
          <h2 className="font-poppins font-semibold text-on-surface text-lg">Personal Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Full Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Phone Number</label>
              <input
                {...register('phone')}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface-variant cursor-not-allowed"
            />
            <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isDirty || updateProfileMutation.isPending}
              className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm flex items-center gap-2"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  Save Changes
                </>
              )}
            </button>
            {saveSuccess && (
              <span className="text-secondary text-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Saved!
              </span>
            )}
          </div>
        </form>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          {addresses?.map((addr) => (
            <div key={addr.id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 card-elevation-1 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-on-surface">{addr.label}</span>
                    {addr.is_default && (
                      <span className="text-[10px] text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full font-bold">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => addr.id && deleteAddressMutation.mutate(addr.id)}
                className="p-1.5 text-outline hover:text-error transition-colors rounded-full hover:bg-error-container/20 flex-shrink-0"
                aria-label="Delete address"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
          ))}

          {!addresses?.length && !showAddAddress && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">location_off</span>
              <p>No saved addresses yet.</p>
            </div>
          )}

          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            {showAddAddress ? 'Cancel' : 'Add New Address'}
          </button>

          {showAddAddress && (
            <div className="bg-surface-container-lowest border border-primary/30 rounded-2xl p-5 space-y-3 shadow-sm">
              <h3 className="font-poppins font-semibold text-on-surface">New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['label', 'line1', 'line2', 'city', 'state', 'pincode'] as const).map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={
                      field === 'line1' ? 'Address Line 1 *'
                      : field === 'line2' ? 'Address Line 2 (optional)'
                      : field.charAt(0).toUpperCase() + field.slice(1) + ' *'
                    }
                    value={(newAddr as Record<string, string>)[field] || ''}
                    onChange={(e) => setNewAddr(prev => ({ ...prev, [field]: e.target.value }))}
                    className={`bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${field === 'line1' || field === 'label' ? 'sm:col-span-2' : ''}`}
                  />
                ))}
              </div>
              <button
                onClick={() => addAddressMutation.mutate()}
                disabled={!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pincode || addAddressMutation.isPending}
                className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-primary-container transition-colors"
              >
                {addAddressMutation.isPending ? 'Saving…' : 'Save Address'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 card-elevation-1 space-y-6">
          <h2 className="font-poppins font-semibold text-on-surface text-lg">Account Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">lock</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Password</p>
                  <p className="text-xs text-on-surface-variant">Last changed: Never</p>
                </div>
              </div>
              <button className="text-primary text-sm font-semibold hover:underline">Change</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">shield</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Two-Factor Authentication</p>
                  <p className="text-xs text-on-surface-variant">Adds an extra layer of security</p>
                </div>
              </div>
              <button className="text-primary text-sm font-semibold hover:underline">Enable</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
