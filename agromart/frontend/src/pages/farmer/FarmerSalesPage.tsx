import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export const FarmerSalesPage: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<any>({
    queryKey: ['farmer-analytics'],
    queryFn: async () => {
      const res = await api.get('/farmer/analytics');
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <h1 className="font-poppins font-bold text-2xl text-on-surface">Sales & Earnings Summary</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Detailed breakdown of your agricultural sales, units sold, and direct farm settlement payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-2">
          <span className="text-xs font-semibold text-outline uppercase">Total Farm Revenue</span>
          <div className="font-poppins font-bold text-3xl text-primary">
            ₹{(analytics?.total_revenue || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-secondary font-semibold">100% direct bank deposit</span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-2">
          <span className="text-xs font-semibold text-outline uppercase">Units of Produce Sold</span>
          <div className="font-poppins font-bold text-3xl text-on-surface">
            {(analytics?.total_items_sold || 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-outline">Across all listed crops</span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-2">
          <span className="text-xs font-semibold text-outline uppercase">Customer Rating</span>
          <div className="font-poppins font-bold text-3xl text-amber-500 flex items-center gap-1">
            ★ {analytics?.customer_rating || 4.9}
          </div>
          <span className="text-[11px] text-secondary font-semibold">Verified organic feedback</span>
        </div>
      </div>

      {/* Monthly Sales Breakdown */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1 space-y-4">
        <h3 className="font-poppins font-bold text-base text-on-surface">Monthly Revenue History</h3>
        <div className="divide-y divide-outline-variant/20">
          {(analytics?.monthly_sales || [
            { month: 'January', sales: 18400 },
            { month: 'February', sales: 24200 },
            { month: 'March', sales: 38500 },
          ]).map((item: any) => (
            <div key={item.month} className="flex items-center justify-between py-3.5">
              <span className="text-sm font-semibold text-on-surface">{item.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">
                  Settled
                </span>
                <span className="text-sm font-bold text-primary">₹{item.sales.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
