import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Package, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product, Department } from '../../lib/database.types';
import ImageUpload from '../../components/ImageUpload';

interface ProductWithDept extends Product {
  departments: Department | null;
}

const emptyForm = {
  name: '',
  department_id: '',
  price: '',
  unit: 'each',
  weight: '',
  image_url: '',
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductWithDept[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function load() {
    const [prodRes, deptRes] = await Promise.all([
      supabase.from('products').select('*, departments(*)').order('name'),
      supabase.from('departments').select('*').order('display_order'),
    ]);
    setProducts((prodRes.data as ProductWithDept[]) || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(p: ProductWithDept) {
    setForm({
      name: p.name,
      department_id: p.department_id || '',
      price: p.price.toString(),
      unit: p.unit,
      weight: p.weight,
      image_url: p.image_url,
      is_active: p.is_active,
    });
    setEditId(p.id);
    setError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      department_id: form.department_id || null,
      price: parseFloat(form.price),
      unit: form.unit,
      weight: form.weight.trim(),
      image_url: form.image_url.trim(),
      is_active: form.is_active,
    };

    if (isNaN(payload.price) || payload.price < 0) {
      setError('Please enter a valid price.');
      setSaving(false);
      return;
    }

    let err;
    if (editId) {
      ({ error: err } = await supabase.from('products').update(payload).eq('id', editId));
    } else {
      ({ error: err } = await supabase.from('products').insert(payload));
    }

    if (err) {
      setError('Failed to save product. Please try again.');
    } else {
      setShowForm(false);
      await load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('products').update({ is_active: false }).eq('id', id);
    setDeleteConfirm(null);
    await load();
  }

  const filtered = products.filter(p => {
    const matchesDept = deptFilter === 'all' || p.departments?.id === deptFilter;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-black text-2xl text-neutral-800">Products</h2>
          <p className="text-neutral-500 text-sm">{products.filter(p => p.is_active).length} active products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
          <Package size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="font-semibold text-neutral-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-4 py-3 font-semibold text-neutral-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden sm:table-cell">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Unit</th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? '' : 'bg-neutral-50/50'}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-800">{p.name}</div>
                      {p.weight && <div className="text-xs text-neutral-400">{p.weight}</div>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-neutral-600">{p.departments?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-brand-blue">R{p.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-neutral-500">{p.unit}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        p.is_active ? 'bg-success/10 text-success-dark' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {p.is_active ? <Check size={10} /> : <X size={10} />}
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors">
                          <Pencil size={15} />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-white bg-brand-red hover:bg-brand-red-dark transition-colors">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && (
                <div className="text-sm text-error bg-error-light border border-error/30 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Product Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 3kg Onions"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Price (R) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="44.99"
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Unit *</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                  >
                    <option value="each">Each</option>
                    <option value="kg">Per kg</option>
                    <option value="pack">Pack</option>
                    <option value="bag">Bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Weight/Size</label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })}
                    placeholder="e.g. 3kg, 500g"
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Department</label>
                  <select
                    value={form.department_id}
                    onChange={e => setForm({ ...form, department_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                  >
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <ImageUpload
                currentUrl={form.image_url}
                onUpload={url => setForm({ ...form, image_url: url })}
                productName={form.name}
              />

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-brand-green transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="text-sm font-semibold text-neutral-700">Active (visible on website)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {editId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
