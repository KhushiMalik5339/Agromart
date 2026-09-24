import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Product, Category } from '../../types';
import { DataService } from '../../services/dataService';

export const AdminProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cat-veg');
  const [price, setPrice] = useState<number>(50);
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState<number>(100);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data || [];
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data || [];
    },
  });

  const saveProductMutation = useMutation({
    mutationFn: async () => {
      const catObj = categories?.find((c) => c.id === category);
      if (editingProduct) {
        return DataService.updateProduct(editingProduct.id, {
          title,
          category_id: category,
          category_name: catObj?.name || 'Produce',
          price: Number(price),
          unit,
          stock_qty: Number(stock),
          images: imageUrl ? [imageUrl] : editingProduct.images,
          description,
          is_organic: isOrganic,
        });
      } else {
        return DataService.addProduct({
          title,
          category_id: category,
          category_name: catObj?.name || 'Produce',
          price: Number(price),
          unit,
          stock_qty: Number(stock),
          images: [imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'],
          description,
          is_organic: isOrganic,
          farmer_name: 'AgroMart Direct',
          farm_name: 'AgroMart Verified Farms',
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['all-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      closeModal();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return DataService.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (product: Product) => {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      return DataService.updateProduct(product.id, { status: newStatus });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('cat-veg');
    setPrice(50);
    setUnit('kg');
    setStock(100);
    setImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800');
    setDescription('');
    setIsOrganic(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category_id);
    setPrice(p.price);
    setUnit(p.unit);
    setStock(p.stock_qty);
    setImageUrl(p.images[0] || '');
    setDescription(p.description);
    setIsOrganic(p.is_organic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = (products || []).filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.farm_name && p.farm_name.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 card-elevation-1">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-on-surface">Product Moderation & Catalog</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Add agricultural products, adjust market pricing, control live stock, and moderate farmer submissions.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCat === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-white text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Products
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === c.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-white text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce or farm..."
            className="w-full bg-white border border-outline-variant/50 rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-base text-outline">search</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl card-elevation-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading product catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">inventory_2</span>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Farm / Seller</th>
                  <th className="text-left px-5 py-3 font-semibold">Price & Unit</th>
                  <th className="text-left px-5 py-3 font-semibold">Stock</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30"
                        />
                        <div>
                          <div className="font-bold text-on-surface">{prod.title}</div>
                          <div className="text-[11px] text-secondary font-semibold flex items-center gap-1">
                            {prod.is_organic && <span>🌿 100% Organic ·</span>}
                            <span>{prod.category_name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant hidden sm:table-cell">
                      <div className="font-semibold text-on-surface">{prod.farm_name}</div>
                      <div>{prod.farmer_name}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-primary">₹{prod.price}</span>
                      <span className="text-xs text-outline ml-0.5">/{prod.unit}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full ${
                          prod.stock_qty <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {prod.stock_qty} left
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleAvailabilityMutation.mutate(prod)}
                        className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full capitalize transition-all ${
                          prod.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {prod.status || 'active'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                          className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.title}"?`)) {
                              deleteProductMutation.mutate(prod.id);
                            }
                          }}
                          title="Delete Product"
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-outline hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto card-elevation-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-poppins font-bold text-lg text-on-surface">
                {editingProduct ? 'Edit Agricultural Product' : 'Add New Agricultural Product'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-container-high text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-on-surface uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Farm Fresh Organic Tomatoes"
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2.5 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary"
                  >
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, litre, packet, 500g"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface font-bold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface uppercase mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border" />
                    <span className="text-[11px] text-outline">Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-on-surface uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh farm harvest, natural soil cultivation..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-organic"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="modal-organic" className="text-xs font-semibold text-on-surface cursor-pointer">
                  Certified Organic Produce
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-outline hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title || price <= 0 || saveProductMutation.isPending}
                onClick={() => saveProductMutation.mutate()}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
