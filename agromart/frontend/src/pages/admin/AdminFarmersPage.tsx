import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { FarmerProfile } from '../../services/dataService';
import { Product, Order } from '../../types';

export const AdminFarmersPage: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending_approval' | 'approved' | 'suspended'>('all');
  const [search, setSearch] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);

  const { data: farmers, isLoading } = useQuery<FarmerProfile[]>({
    queryKey: ['admin-farmers'],
    queryFn: async () => {
      const res = await api.get('/admin/farmers');
      return res.data || [];
    },
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data || [];
    },
  });

  const { data: allOrders } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      const res = await api.patch(`/admin/farmers/${farmerId}/approve`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-farmers'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      const res = await api.patch(`/admin/farmers/${farmerId}/reject`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-farmers'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      const res = await api.patch(`/admin/farmers/${farmerId}/status`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-farmers'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const filteredFarmers = (farmers || []).filter((f) => {
    const matchesFilter = filter === 'all' || f.status === filter;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.farm_name.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.state.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFarmerProducts = (farmerId: string) => {
    return (allProducts || []).filter((p) => p.farmer_id === farmerId);
  };

  const getFarmerOrders = (farmerId: string) => {
    const pids = new Set(getFarmerProducts(farmerId).map((p) => p.id));
    return (allOrders || []).filter((o) => o.items.some((i) => pids.has(i.product_id)));
  };

  const STATUS_BADGES: Record<string, { label: string; class: string }> = {
    approved: { label: 'Approved & Active', class: 'bg-green-100 text-green-800 border-green-300' },
    pending_approval: { label: 'Pending Approval', class: 'bg-amber-100 text-amber-800 border-amber-300' },
    rejected: { label: 'Rejected', class: 'bg-rose-100 text-rose-800 border-rose-300' },
    suspended: { label: 'Suspended', class: 'bg-red-100 text-red-800 border-red-300' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">Farmer Management</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review farmer verification, approve onboarding, manage active farm listings & view sales performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-secondary bg-secondary-container/60 px-3 py-1.5 rounded-full">
            {farmers?.length || 0} Registered Farmers
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'pending_approval', 'approved', 'suspended'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-white text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm name, owner, city..."
            className="w-full bg-white border border-outline-variant/50 rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-base text-outline">search</span>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading farmers...</div>
        ) : filteredFarmers.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">agriculture</span>
            <p>No farmers match your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Farmer & Farm</th>
                  <th className="text-left px-5 py-3 font-semibold">Location</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Farming Type</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold hidden lg:table-cell">Sales</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredFarmers.map((farmer) => {
                  const badge = STATUS_BADGES[farmer.status] || STATUS_BADGES.approved;
                  return (
                    <tr key={farmer.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-xl">agriculture</span>
                          </div>
                          <div>
                            <div className="font-bold text-on-surface">{farmer.farm_name}</div>
                            <div className="text-xs text-on-surface-variant">{farmer.name} · {farmer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant">
                        <div>{farmer.village}</div>
                        <div className="font-medium text-on-surface">{farmer.district}, {farmer.state}</div>
                      </td>
                      <td className="px-5 py-4 text-xs hidden md:table-cell">
                        <span className="font-semibold text-secondary">{farmer.farming_type}</span>
                        <div className="text-[10px] text-outline font-mono mt-0.5">{farmer.verification_details}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold border px-2.5 py-1 rounded-full ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right hidden lg:table-cell">
                        <div className="font-bold text-primary">₹{(farmer.total_sales || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-on-surface-variant">{farmer.orders_count || 0} orders</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedFarmer(farmer)}
                            title="View Full Profile & Products"
                            className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>

                          {farmer.status === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => approveMutation.mutate(farmer.id)}
                                title="Approve Farmer"
                                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectMutation.mutate(farmer.id)}
                                title="Reject Farmer"
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {farmer.status === 'approved' && (
                            <button
                              onClick={() => toggleStatusMutation.mutate(farmer.id)}
                              title="Suspend Account"
                              className="text-amber-700 hover:bg-amber-50 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-300 transition-all"
                            >
                              Suspend
                            </button>
                          )}

                          {farmer.status === 'suspended' && (
                            <button
                              onClick={() => toggleStatusMutation.mutate(farmer.id)}
                              title="Reactivate Account"
                              className="text-green-700 hover:bg-green-50 text-xs font-semibold px-2.5 py-1 rounded-lg border border-green-300 transition-all"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Farmer Profile Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-2xl">agriculture</span>
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-xl text-on-surface">{selectedFarmer.farm_name}</h3>
                  <p className="text-xs text-on-surface-variant">Owner: {selectedFarmer.name} ({selectedFarmer.email})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="p-1 rounded-full hover:bg-surface-container-high text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Farm Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-surface-container-low p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Phone</span>
                <p className="text-xs font-bold text-on-surface mt-0.5">{selectedFarmer.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Location</span>
                <p className="text-xs font-bold text-on-surface mt-0.5">{selectedFarmer.village}, {selectedFarmer.district}, {selectedFarmer.state}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Farming Type</span>
                <p className="text-xs font-bold text-secondary mt-0.5">{selectedFarmer.farming_type}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Certification No</span>
                <p className="text-xs font-mono text-on-surface mt-0.5">{selectedFarmer.verification_details}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Total Sales</span>
                <p className="text-xs font-bold text-primary mt-0.5">₹{(selectedFarmer.total_sales || 0).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Status</span>
                <p className="text-xs font-bold text-on-surface capitalize mt-0.5">{selectedFarmer.status.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Farmer's Products */}
            <div className="space-y-3">
              <h4 className="font-poppins font-bold text-sm text-on-surface flex items-center justify-between">
                <span>Products Listed by this Farm ({getFarmerProducts(selectedFarmer.id).length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {getFarmerProducts(selectedFarmer.id).map((prod) => (
                  <div key={prod.id} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-on-surface line-clamp-1">{prod.title}</div>
                      <div className="text-[11px] text-primary font-bold">₹{prod.price} /{prod.unit}</div>
                      <div className="text-[10px] text-on-surface-variant">Stock: {prod.stock_qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmer's Recent Orders */}
            <div className="space-y-3">
              <h4 className="font-poppins font-bold text-sm text-on-surface">
                Orders Received ({getFarmerOrders(selectedFarmer.id).length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getFarmerOrders(selectedFarmer.id).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-on-surface">#{order.order_number}</span>
                      <span className="text-on-surface-variant ml-2 capitalize">Status: {order.order_status}</span>
                    </div>
                    <span className="font-bold text-primary">₹{order.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
