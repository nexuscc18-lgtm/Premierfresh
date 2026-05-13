import { useEffect, useState } from 'react';
import { Calendar, Tag, AlertCircle, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PromotionWithItems } from '../lib/database.types';

function PriceDisplay({ price }: { price: number }) {
  const [rands, cents] = price.toFixed(2).split('.');
  return (
    <div className="price-tag">
      <span className="text-sm align-super font-black">R</span>
      <span className="text-4xl">{rands}</span>
      <span className="text-lg align-super">.{cents}</span>
    </div>
  );
}

export default function SpecialsPage() {
  const [promotions, setPromotions] = useState<PromotionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePromoIdx, setActivePromoIdx] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    async function fetchAll() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('promotions')
        .select(`*, promotion_items(*, products(*, departments(*)))`)
        .eq('is_active', true)
        .order('valid_from', { ascending: false });
      setPromotions((data as PromotionWithItems[]) || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

  const activePromo = promotions[activePromoIdx];
  const allItems = activePromo?.promotion_items || [];
  const departments = ['all', ...Array.from(new Set(allItems.map(i => i.products?.departments?.slug).filter(Boolean)))];
  const filteredItems = departmentFilter === 'all'
    ? allItems
    : allItems.filter(i => i.products?.departments?.slug === departmentFilter);

  const placeholders: Record<string, string> = {
    'fruit-veg': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
    'butchery': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    'grocery': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    'bakery': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page header */}
      <div className="gradient-blue py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Tag size={14} />
            WEEKLY SPECIALS
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl mb-2">This Week's Best Deals</h1>
          <p className="text-blue-200 text-lg">Unbeatable prices across all departments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-24">
            <Tag size={48} className="text-neutral-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-neutral-500 mb-2">No Active Specials</h2>
            <p className="text-neutral-400">Check back soon for our latest deals!</p>
          </div>
        ) : (
          <>
            {/* Promotion selector tabs */}
            {promotions.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {promotions.map((promo, idx) => (
                  <button
                    key={promo.id}
                    onClick={() => { setActivePromoIdx(idx); setDepartmentFilter('all'); }}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      activePromoIdx === idx
                        ? 'bg-brand-blue text-white shadow-md'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {promo.title}
                  </button>
                ))}
              </div>
            )}

            {/* Active promo info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-black text-2xl text-brand-blue">{activePromo.title}</h2>
                {activePromo.subtitle && <p className="text-neutral-500">{activePromo.subtitle}</p>}
              </div>
              <div className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0">
                <Calendar size={15} />
                {formatDate(activePromo.valid_from)} – {formatDate(activePromo.valid_to)}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-neutral-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Prices valid while stocks last. Images used are for illustrative/advertising purposes only. E&OE.</span>
            </div>

            {/* Department filter */}
            {departments.length > 2 && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <Filter size={16} className="text-neutral-400 flex-shrink-0" />
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      departmentFilter === dept
                        ? 'bg-brand-red text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {dept === 'all' ? 'All Departments' : (
                      dept.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ')
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Product grid */}
            {filteredItems.length === 0 ? (
              <p className="text-center text-neutral-400 py-12">No items in this category.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(item => {
                    const product = item.products;
                    const deptSlug = product.departments?.slug ?? 'grocery';
                    const imgSrc = product.image_url || placeholders[deptSlug] || placeholders['grocery'];
                    const savings = product.price - item.special_price;
                    const savingsPct = savings > 0 ? Math.round((savings / product.price) * 100) : 0;

                    return (
                      <div key={item.id} className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                        <div className="relative overflow-hidden h-44 bg-neutral-100">
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {savingsPct > 0 && (
                            <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-black px-2 py-1 rounded-full shadow">
                              -{savingsPct}%
                            </div>
                          )}
                          {product.departments && (
                            <div className="absolute bottom-2 right-2 bg-white/90 text-neutral-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                              {product.departments.name}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-sm text-neutral-800 leading-tight mb-2">
                            {product.weight && <span className="text-neutral-400">{product.weight} </span>}
                            {product.name}
                          </h3>
                          <div className="mt-auto flex items-end justify-between">
                            <div>
                              <PriceDisplay price={item.special_price} />
                              <span className="text-xs text-neutral-400">{product.unit === 'kg' ? '/kg' : 'each'}</span>
                            </div>
                            {savings > 0 && (
                              <div className="text-right">
                                <div className="text-xs text-neutral-400 line-through">R{product.price.toFixed(2)}</div>
                                <div className="text-xs text-brand-green font-bold">Save R{savings.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
