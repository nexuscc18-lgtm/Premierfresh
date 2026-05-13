import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Promotion, Product, Department, PromotionItem } from '../../lib/database.types';

interface ProductWithDept extends Product {
  departments: Department | null;
}

interface PromotionItemWithProduct extends PromotionItem {
  products: ProductWithDept;
}

interface FullPromotion extends Promotion {
  promotion_items: PromotionItemWithProduct[];
}

const emptyPromoForm = {
  title: '',
  subtitle: '',
  valid_from: '',
  valid_to: '',
  is_active: true,
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<FullPromotion[]>([]);
  const [products, setProducts] = useState<ProductWithDept[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Promotion form state
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editPromoId, setEditPromoId] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState(emptyPromoForm);
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Item form state
  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  const [itemProductId, setItemProductId] = useState('');
  const [itemSpecialPrice, setItemSpecialPrice] = useState('');
  const [savingItem, setSavingItem] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const [deleteConfirmPromo, setDeleteConfirmPromo] = useState<string | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<string | null>(null);

  async function load() {
    const [promoRes, prodRes] = await Promise.all([
      supabase
        .from('promotions')
        .select('*, promotion_items(*, products(*, departments(*)))')
        .order('valid_from', { ascending: false }),
      supabase.from('products').select('*, departments(*)').eq('is_active', true).order('name'),
    ]);
    setPromotions((promoRes.data as FullPromotion[]) || []);
    setProducts((prodRes.data as ProductWithDept[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAddPromo() {
    setPromoForm(emptyPromoForm);
    setEditPromoId(null);
    setPromoError(null);
    setShowPromoForm(true);
  }

  function openEditPromo(p: FullPromotion) {
    setPromoForm({
      title: p.title,
      subtitle: p.subtitle,
      valid_from: p.valid_from,
      valid_to: p.valid_to,
      is_active: p.is_active,
    });
    setEditPromoId(p.id);
    setPromoError(null);
    setShowPromoForm(true);
  }

  async function handleSavePromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoError(null);
    setSavingPromo(true);

    const payload = {
      title: promoForm.title.trim(),
      subtitle: promoForm.subtitle.trim(),
      valid_from: promoForm.valid_from,
      valid_to: promoForm.valid_to,
      is_active: promoForm.is_active,
    };

    let err;
    if (editPromoId) {
      ({ error: err } = await supabase.from('promotions').update(payload).eq('id', editPromoId));
    } else {
      ({ error: err } = await supabase.from('promotions').insert(payload));
    }

    if (err) {
      setPromoError('Failed to save promotion. Please try again.');
    } else {
      setShowPromoForm(false);
      await load();
    }
    setSavingPromo(false);
  }

  async function handleDeletePromo(id: string) {
    await supabase.from('promotions').delete().eq('id', id);
    setDeleteConfirmPromo(null);
    await load();
  }

  async function handleAddItem(promotionId: string) {
    setItemError(null);
    setSavingItem(true);

    const price = parseFloat(itemSpecialPrice);
    if (!itemProductId || isNaN(price) || price < 0) {
      setItemError('Please select a product and enter a valid price.');
      setSavingItem(false);
      return;
    }

    const promo = promotions.find(p => p.id === promotionId);
    const nextOrder = (promo?.promotion_items.length || 0);

    const { error } = await supabase.from('promotion_items').insert({
      promotion_id: promotionId,
      product_id: itemProductId,
      special_price: price,
      display_order: nextOrder,
    });

    if (error) {
      setItemError('Failed to add item. It may already be in this promotion.');
    } else {
      setShowItemForm(null);
      setItemProductId('');
      setItemSpecialPrice('');
      await load();
    }
    setSavingItem(false);
  }

  async function handleDeleteItem(id: string) {
    await supabase.from('promotion_items').delete().eq('id', id);
    setDeleteConfirmItem(null);
    await load();
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

  const isActive = (p: Promotion) => {
    const today = new Date().toISOString().split('T')[0];
    return p.is_active && p.valid_from <= today && p.valid_to >= today;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-black text-2xl text-neutral-800">Weekly Specials</h2>
          <p className="text-neutral-500 text-sm">Create and manage promotional campaigns</p>
        </div>
        <button onClick={openAddPromo} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} /> New Promotion
        </button>
      </div>

      {/* How it works */}
      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 text-sm">
        <p className="font-bold text-brand-blue mb-1">How Weekly Specials Work</p>
        <p className="text-neutral-600">
          Create a promotion with validity dates, then add products with their special prices. Active promotions within their date range automatically appear on the website.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
          <Tag size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="font-semibold text-neutral-500 mb-4">No promotions yet</p>
          <button onClick={openAddPromo} className="btn-secondary">Create Your First Promotion</button>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              {/* Promo header */}
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedId(expandedId === promo.id ? null : promo.id)}
                    className="mt-0.5 p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors flex-shrink-0"
                  >
                    {expandedId === promo.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-neutral-800">{promo.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive(promo)
                          ? 'bg-success/10 text-success-dark'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {isActive(promo) ? 'LIVE' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {formatDate(promo.valid_from)} &ndash; {formatDate(promo.valid_to)} &bull; {promo.promotion_items.length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEditPromo(promo)} className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors">
                    <Pencil size={15} />
                  </button>
                  {deleteConfirmPromo === promo.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDeletePromo(promo.id)} className="p-1.5 rounded-lg bg-brand-red text-white hover:bg-brand-red-dark transition-colors">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirmPromo(null)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmPromo(promo.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded items */}
              {expandedId === promo.id && (
                <div className="border-t border-neutral-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-neutral-700 text-sm">Special Items ({promo.promotion_items.length})</h4>
                    <button
                      onClick={() => { setShowItemForm(promo.id); setItemProductId(''); setItemSpecialPrice(''); setItemError(null); }}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:bg-brand-blue/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  {/* Item form */}
                  {showItemForm === promo.id && (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-3">
                      <h5 className="font-semibold text-neutral-700 text-sm mb-3">Add Special Item</h5>
                      {itemError && (
                        <p className="text-xs text-error bg-error-light rounded-lg px-3 py-2 mb-3">{itemError}</p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">Product *</label>
                          <select
                            value={itemProductId}
                            onChange={e => setItemProductId(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          >
                            <option value="">Select a product...</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} {p.weight ? `(${p.weight})` : ''} — R{p.price.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">Special Price (R) *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={itemSpecialPrice}
                            onChange={e => setItemSpecialPrice(e.target.value)}
                            placeholder="e.g. 44.99"
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddItem(promo.id)}
                          disabled={savingItem}
                          className="btn-primary text-xs py-2 flex items-center gap-1.5"
                        >
                          {savingItem ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={13} />}
                          Add to Promotion
                        </button>
                        <button
                          onClick={() => setShowItemForm(null)}
                          className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  {promo.promotion_items.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-4">No items yet. Click "Add Item" to add special products.</p>
                  ) : (
                    <div className="space-y-2">
                      {promo.promotion_items
                        .sort((a, b) => a.display_order - b.display_order)
                        .map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                            <GripVertical size={14} className="text-neutral-300 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-neutral-800 truncate">
                                {item.products.weight && <span className="text-neutral-400">{item.products.weight} </span>}
                                {item.products.name}
                              </p>
                              <p className="text-xs text-neutral-500">{item.products.departments?.name}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-black text-brand-red text-sm">R{item.special_price.toFixed(2)}</p>
                              <p className="text-xs text-neutral-400 line-through">R{item.products.price.toFixed(2)}</p>
                            </div>
                            {deleteConfirmItem === item.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded-md bg-brand-red text-white">
                                  <Check size={12} />
                                </button>
                                <button onClick={() => setDeleteConfirmItem(null)} className="p-1 rounded-md text-neutral-400 hover:bg-neutral-200">
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirmItem(item.id)} className="p-1.5 rounded-lg text-neutral-300 hover:text-brand-red hover:bg-brand-red/10 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Promotion Form Modal */}
      {showPromoForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">{editPromoId ? 'Edit Promotion' : 'New Promotion'}</h3>
              <button onClick={() => setShowPromoForm(false)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePromo} className="p-5 space-y-4">
              {promoError && (
                <div className="text-sm text-error bg-error-light border border-error/30 rounded-xl px-4 py-3">{promoError}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Promotion Title *</label>
                <input
                  required
                  type="text"
                  value={promoForm.title}
                  onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                  placeholder="e.g. May Week 2 Specials"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Subtitle (optional)</label>
                <input
                  type="text"
                  value={promoForm.subtitle}
                  onChange={e => setPromoForm({ ...promoForm, subtitle: e.target.value })}
                  placeholder="e.g. Huge savings across all departments"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Valid From *</label>
                  <input
                    required
                    type="date"
                    value={promoForm.valid_from}
                    onChange={e => setPromoForm({ ...promoForm, valid_from: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Valid To *</label>
                  <input
                    required
                    type="date"
                    value={promoForm.valid_to}
                    onChange={e => setPromoForm({ ...promoForm, valid_to: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.is_active}
                    onChange={e => setPromoForm({ ...promoForm, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-brand-green transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="text-sm font-semibold text-neutral-700">Active (visible on website when within date range)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPromoForm(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPromo}
                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                >
                  {savingPromo ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {editPromoId ? 'Save Changes' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
