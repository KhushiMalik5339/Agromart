import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import { Product } from '../../types';

type ProductFormData = Omit<Product, 'id' | 'slug' | 'farmer_id' | 'farmer_name' | 'farm_name' | 'category_name' | 'rating_avg' | 'rating_count' | 'created_at' | 'images' | 'benefits' | 'badges' | 'nutrition'> & {
  images_csv: string;
  benefits_csv: string;
  badges_csv: string;
};

export const FarmerProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['farmer-products'],
    queryFn: async () => {
      const res = await api.get('/farmer/products');
      return res.data;
    },
  });

  const { data: categories } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProductFormData>();

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const payload = {
        ...data,
        price: Number(data.price),
        stock_qty: Number(data.stock_qty),
        images: data.images_csv ? data.images_csv.split(',').map(s => s.trim()) : [],
        benefits: data.benefits_csv ? data.benefits_csv.split(',').map(s => s.trim()) : [],
        badges: data.badges_csv ? data.badges_csv.split(',').map(s => s.trim()) : [],
        nutrition: {},
        is_organic: Boolean(data.is_organic),
      };
      if (editProduct) {
        const res = await api.put(`/farmer/products/${editProduct.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/farmer/products', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['farmer-products'] });
      setIsFormOpen(false);
      setEditProduct(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/farmer/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['farmer-products'] });
      setDeleteConfirm(null);
    },
  });

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      stock_qty: product.stock_qty,
      unit: product.unit,
      category_id: product.category_id,
      is_organic: product.is_organic,
      status: product.status,
      images_csv: product.images?.join(', ') || '',
      benefits_csv: product.benefits?.join(', ') || '',
      badges_csv: product.badges?.join(', ') || '',
    });
    setIsFormOpen(true);
  };

  const filtered = products?.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">My Products</h1>
          <p className="text-sm text-on-surface-variant">Manage your organic farm listings</p>
        </div>
        <button
          onClick={() => { setIsFormOpen(true); setEditProduct(null); reset(); }}
          className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-3 material-symbols-outlined text-xl text-outline">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your products…"
          className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Product Form */}
      {isFormOpen && (
        <div className="bg-surface-container-lowest border border-primary/30 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-on-surface text-lg">
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={() => { setIsFormOpen(false); setEditProduct(null); }} className="text-outline hover:text-error transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Product Title *</label>
                <input {...register('title', { required: true })} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g. Kashmiri Mongra Saffron" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Price (₹) *</label>
                <input {...register('price', { required: true })} type="number" step="0.01" className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="350.00" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Unit *</label>
                <input {...register('unit', { required: true })} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="g, kg, dozen, litre…" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Stock Quantity *</label>
                <input {...register('stock_qty', { required: true })} type="number" className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="100" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Category</label>
                <select {...register('category_id')} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="">Select category…</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Description *</label>
                <textarea {...register('description', { required: true })} rows={3} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Describe your product, growing methods, certifications…" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Image URLs (comma separated)</label>
                <input {...register('images_csv')} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="https://…, https://…" />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Benefits (comma separated)</label>
                <input {...register('benefits_csv')} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Rich in antioxidants, No pesticides…" />
              </div>

              <div className="flex items-center gap-3">
                <input {...register('is_organic')} type="checkbox" id="is_organic" className="w-4 h-4 accent-primary rounded" />
                <label htmlFor="is_organic" className="text-sm font-medium text-on-surface">Certified Organic</label>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1">Status</label>
                <select {...register('status')} className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
                className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {createMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><span className="material-symbols-outlined text-base">save</span>{editProduct ? 'Update Product' : 'Create Listing'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-surface-container-low rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">inventory_2</span>
          <p className="font-semibold">No products found.</p>
          <p className="text-sm mt-1">Add your first product listing above!</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
          <div className="divide-y divide-outline-variant/20">
            {filtered.map((product) => (
              <div key={product.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=80'}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover border border-outline-variant/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm line-clamp-1">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-primary font-bold">₹{product.price}/{product.unit}</span>
                      <span className="text-xs text-on-surface-variant">·</span>
                      <span className={`text-xs font-medium ${product.stock_qty === 0 ? 'text-error' : product.stock_qty < 10 ? 'text-amber-600' : 'text-secondary'}`}>
                        {product.stock_qty === 0 ? 'Out of stock' : `${product.stock_qty} ${product.unit}`}
                      </span>
                      {product.is_organic && (
                        <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">Organic</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] border rounded-full px-2.5 py-0.5 font-semibold capitalize ${
                      product.status === 'active' ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant/40'
                    }`}>
                      {product.status || 'active'}
                    </span>
                    <button onClick={() => handleEdit(product)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                {/* Delete confirmation inline */}
                {deleteConfirm === product.id && (
                  <div className="bg-error-container/20 border-t border-error/20 px-4 py-3 flex items-center justify-between">
                    <p className="text-sm text-error font-medium">Delete "{product.title}"? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                      <button
                        onClick={() => deleteMutation.mutate(product.id)}
                        disabled={deleteMutation.isPending}
                        className="bg-error text-on-error text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
