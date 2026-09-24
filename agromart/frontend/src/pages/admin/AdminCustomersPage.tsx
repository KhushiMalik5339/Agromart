import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { CustomerProfile, DataService } from '../../services/dataService';
import { Order } from '../../types';

export const AdminCustomersPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const { data: customers, isLoading } = useQuery<CustomerProfile[]>({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      return DataService.getCustomers();
    },
  });

  const { data: allOrders } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return res.data || [];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (customerId: string) => {
      return DataService.toggleCustomerStatus(customerId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });

  const filteredCustomers = (customers || []).filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  });

  const getCustomerOrders = (customerId: string) => {
    return (allOrders || []).filter((o) => o.user_id === customerId || (customerId === 'c-1' && o.user_id === 'c-1'));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">Customer Management</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            View registered organic food buyers, transaction history, addresses & manage account access.
          </p>
        </div>
        <div>
          <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1.5 rounded-full">
            {customers?.length || 0} Registered Buyers
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone..."
            className="w-full bg-white border border-outline-variant/50 rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-base text-outline">search</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">group</span>
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Contact</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Orders Placed</th>
                  <th className="text-right px-5 py-3 font-semibold">Total Spent</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cust.name)}`}
                          alt={cust.name}
                          className="w-10 h-10 rounded-full border border-primary/20"
                        />
                        <div>
                          <div className="font-bold text-on-surface">{cust.name}</div>
                          <div className="text-xs text-on-surface-variant">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant hidden sm:table-cell">
                      {cust.phone}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] font-semibold border px-2.5 py-1 rounded-full capitalize ${
                          cust.status === 'active'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs hidden md:table-cell font-medium">
                      {cust.total_orders} orders
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-primary">
                      ₹{cust.total_spent.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          title="View Orders & Details"
                          className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">receipt_long</span>
                        </button>
                        <button
                          onClick={() => toggleStatusMutation.mutate(cust.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            cust.status === 'active'
                              ? 'text-rose-700 hover:bg-rose-50 border-rose-300'
                              : 'text-green-700 hover:bg-green-50 border-green-300'
                          }`}
                        >
                          {cust.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Orders Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedCustomer.name)}`}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <h3 className="font-poppins font-bold text-xl text-on-surface">{selectedCustomer.name}</h3>
                  <p className="text-xs text-on-surface-variant">{selectedCustomer.email} · {selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full hover:bg-surface-container-high text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Total Orders</span>
                <p className="text-sm font-bold text-on-surface mt-0.5">{selectedCustomer.total_orders}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">Total Spent</span>
                <p className="text-sm font-bold text-primary mt-0.5">₹{selectedCustomer.total_spent.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-poppins font-bold text-sm text-on-surface">Customer Order History</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {getCustomerOrders(selectedCustomer.id).map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface">#{order.order_number}</span>
                      <span className="text-[10px] font-semibold bg-primary-container/20 text-primary px-2 py-0.5 rounded-full capitalize">
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {order.items.map((i) => `${i.title} (${i.qty} ${i.unit})`).join(', ')}
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-outline-variant/20">
                      <span className="text-outline">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</span>
                      <span className="font-bold text-primary">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
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
