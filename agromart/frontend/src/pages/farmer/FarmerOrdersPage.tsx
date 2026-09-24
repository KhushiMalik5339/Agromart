import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Order } from '../../types';

export const FarmerOrdersPage: React.FC = () => {
  const qc = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['farmer-orders'],
    queryFn: async () => {
      const res = await api.get('/farmer/orders');
      return res.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: any }) => {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { order_status: status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['farmer-orders'] });
      qc.invalidateQueries({ queryKey: ['farmer-analytics'] });
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: prev.order_status } : null));
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">Customer Farm Orders</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Orders placed by consumers for crops harvested on your farm. Confirm, pack, and ship orders.
          </p>
        </div>
        <div>
          <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1.5 rounded-full">
            {orders?.length || 0} Orders Received
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading orders...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">local_shipping</span>
            <p>No orders received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Order</th>
                  <th className="text-left px-5 py-3 font-semibold">Your Crops Ordered</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Shipping Destination</th>
                  <th className="text-left px-5 py-3 font-semibold">Current Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-on-surface">#{order.order_number}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant">
                      {order.items.map((i) => (
                        <div key={i.product_id} className="font-medium text-on-surface">
                          {i.title} <span className="text-primary font-bold">× {i.qty} {i.unit}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant hidden md:table-cell">
                      <div>{order.address?.city}, {order.address?.state}</div>
                      <div className="text-[10px] text-outline">PIN: {order.address?.pincode}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold capitalize bg-primary-container/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-primary hover:underline px-2 py-1"
                        >
                          View Details
                        </button>
                        {order.order_status === 'placed' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'packed' })}
                            className="bg-amber-500 hover:bg-amber-600 text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Pack Order
                          </button>
                        )}
                        {order.order_status === 'packed' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'shipped' })}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.order_status === 'shipped' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'delivered' })}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <h3 className="font-poppins font-bold text-lg text-on-surface">Order #{selectedOrder.order_number}</h3>
                <p className="text-xs text-on-surface-variant">Status: {selectedOrder.order_status}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-surface-container-high text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-outline">Customer Delivery Details</span>
              <div className="bg-surface-container-low p-4 rounded-xl text-xs space-y-1">
                <p className="font-bold text-on-surface">{selectedOrder.address?.label}</p>
                <p className="text-on-surface-variant">{selectedOrder.address?.line1}</p>
                <p className="text-on-surface-variant">{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-outline">Items Ordered From Your Farm</span>
              <div className="space-y-2">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl text-xs">
                    <div>
                      <div className="font-bold text-on-surface">{i.title}</div>
                      <div className="text-on-surface-variant">Qty: {i.qty} {i.unit}</div>
                    </div>
                    <div className="font-bold text-primary">₹{(i.price * i.qty).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2 rounded-xl"
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
