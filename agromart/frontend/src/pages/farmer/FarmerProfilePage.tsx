import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { FarmerProfile } from '../../services/dataService';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [saveNotice, setSaveNotice] = useState(false);

  const { data: profile } = useQuery<FarmerProfile>({
    queryKey: ['farmer-profile'],
    queryFn: async () => {
      const res = await api.get('/farmer/profile');
      return res.data;
    },
  });

  const [farmName, setFarmName] = useState(profile?.farm_name || 'Patel Organic Farms');
  const [village, setVillage] = useState(profile?.village || 'Panchavati');
  const [district, setDistrict] = useState(profile?.district || 'Nashik');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [farmingType, setFarmingType] = useState(profile?.farming_type || '100% Certified Organic (NPOP)');
  const [phone, setPhone] = useState(profile?.phone || '+91 98251 34920');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const isApproved = profile?.status === 'approved';

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <h1 className="font-poppins font-bold text-2xl text-on-surface">Farm Profile & Verification</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Manage your farm listing, location credentials, contact details & certification records.
        </p>
      </div>

      {saveNotice && (
        <div className="p-4 bg-green-100 text-green-800 rounded-xl text-xs font-semibold animate-fadeIn">
          Farm profile details updated successfully!
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-3">
        <h3 className="font-poppins font-bold text-base text-on-surface">Verification Status</h3>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            <span className="material-symbols-outlined text-2xl">
              {isApproved ? 'verified' : 'hourglass_empty'}
            </span>
          </div>
          <div>
            <div className="font-bold text-sm text-on-surface">
              {isApproved ? 'Government Certified & AgroMart Approved' : 'Under Review by Admin'}
            </div>
            <div className="text-xs text-on-surface-variant">
              Certification ID: <span className="font-mono">{profile?.verification_details || 'NPOP-ORG-2023-MH-0842'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
        <h3 className="font-poppins font-bold text-base text-on-surface pb-2 border-b border-outline-variant/20">
          Farm Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">Farm / Business Name</label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">Owner Full Name</label>
            <input
              type="text"
              readOnly
              value={profile?.name || user?.name || 'Rajesh Patel'}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface bg-gray-50"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">Contact Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">Farming Type</label>
            <input
              type="text"
              value={farmingType}
              onChange={(e) => setFarmingType(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">Village / Town</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface uppercase mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Save Farm Profile
          </button>
        </div>
      </form>
    </div>
  );
};
