import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Category, Product } from '../../types';
import { DataService } from '../../services/dataService';

export const AdminCategoriesPage: React.FC = () => {
  const qc = useQueryClient();
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('eco');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
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

  const addCatMutation = useMutation({
    mutationFn: async () => {
      return DataService.addCategory(newCatName, newCatSlug, newCatIcon);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setNewCatName('');
      setNewCatSlug('');
      setIsAddOpen(false);
    },
  });

  const getProductCount = (catId: string, slug: string) => {
    return (allProducts || []).filter((p) => p.category_id === catId || p.category_name?.toLowerCase().includes(slug)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">AgroMart Categories</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Organize agricultural catalog into organic food categories & manage marketplace taxonomy.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Category
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-primary/40 space-y-4 card-elevation-1 animate-fadeIn">
          <h3 className="font-poppins font-bold text-base text-on-surface">Create New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-on-surface mb-1">Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Organic Beverages"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-on-surface mb-1">Slug</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="organic-beverages"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-on-surface mb-1">Icon (Material Symbol)</label>
              <input
                type="text"
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                placeholder="eco, nutrition, grain..."
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-outline"
            >
              Cancel
            </button>
            <button
              onClick={() => addCatMutation.mutate()}
              disabled={!newCatName || !newCatSlug}
              className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-xl"
            >
              Save Category
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => {
          const count = getProductCount(cat.id, cat.slug);
          return (
            <div
              key={cat.id}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 card-elevation-1 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{cat.icon || 'eco'}</span>
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-base text-on-surface">{cat.name}</h3>
                  <p className="text-xs text-on-surface-variant font-mono">/category/{cat.slug}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary bg-primary-container/15 px-2.5 py-1 rounded-full">
                  {count} products
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
