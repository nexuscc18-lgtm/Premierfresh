import { useEffect, useState } from 'react';
import { Calendar, Tag, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PromotionWithItems } from '../lib/database.types';

interface WeeklySpecialsProps {
  onNavigate: (page: string) => void;
}

function PriceDisplay({ price }: { price: number }) {
  const [rands, cents] = price.toFixed(2).split('.');
  return (
    <div className="price-tag">
      <span className="text-xs align-super font-black">R</span>
      <span className="text-4xl">{rands}</span>
      <span className="text-xl align-super">.{cents}</span>
    </div>
  );
}

function SpecialCard({ item, originalPrice }: { item: PromotionWithItems['promotion_items'][0]; originalPrice: number }) {
  const product = item.products;
  const savings = originalPrice - item.special_price;
  const savingsPct = Math.round((savings / originalPrice) * 100);

  const placeholderImages: Record<string, string> = {
    'fruit-veg': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=300',
    'butchery': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
    'grocery': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=300',
    'bakery': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300',
  };

  const deptSlug = product.departments?.slug ?? 'grocery';
  const imgSrc = product.image_url || placeholderImages[deptSlug] || placeholderImages['grocery'];

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative overflow-hidden bg-brand-teal/10 h-44">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {savingsPct > 0 && (
          <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-black px-2 py-1 rounded-full shadow">
            SAVE {savingsPct}%
          </div>
        )}
        {product.departments && (
          <div className="absolute top-3 right-3 bg-white/90 text-neutral-700 text-xs font-semibold px-2 py-1 rounded-full">
            {product.departments.name}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-neutral-800 text-sm leading-tight mb-1">
          {product.weight && <span className="text-neutral-500">{product.weight} </span>}
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <PriceDisplay price={item.special_price} />
            <span className="text-xs text-neutral-500 font-medium">{product.unit === 'kg' ? 'per kg' : 'each'}</span>
          </div>
          {originalPrice > item.special_price && (
            <div className="text-right">
              <div className="text-xs text-neutral-400 line-through">R{originalPrice.toFixed(2)}</div>
              <div className="text-xs text-brand-green font-bold">Save R{savings.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WeeklySpecials({ onNavigate }: WeeklySpecialsProps) {
  const [promotions, setPromotions] = useState<PromotionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPromotions() {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          promotion_items (
            *,
            products (
              *,
              departments (*)
            )
          )
        `)
        .eq('is_active', true)
        .lte('valid_from', today)
        .gte('valid_to', today)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Unable to load promotions.');
      } else {
        setPromotions((data as PromotionWithItems[]) || []);
      }
      setLoading(false);
    }
    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-neutral-400 py-16">
            <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Loading specials...</span>
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Tag size={16} />
            Weekly Specials
          </div>
          <h2 className="section-heading mb-4">This Week's Best Deals</h2>
          <p className="text-neutral-500 text-lg">New specials are being prepared. Check back soon!</p>
        </div>
      </section>
    );
  }

  const activePromo = promotions[0];
  const items = activePromo.promotion_items.sort((a, b) => a.display_order - b.display_order);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="specials" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-sm font-bold mb-3">
              <Tag size={14} />
              WEEKLY SPECIALS
            </div>
            <h2 className="section-heading">{activePromo.title}</h2>
            {activePromo.subtitle && (
              <p className="text-neutral-500 mt-1">{activePromo.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2.5 rounded-xl text-sm font-semibold">
            <Calendar size={16} />
            <span>Valid {formatDate(activePromo.valid_from)} – {formatDate(activePromo.valid_to)}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-brand-orange/10 border border-brand-orange/20 text-neutral-700 rounded-xl px-4 py-3 mb-8 text-sm">
          <AlertCircle size={16} className="text-brand-orange flex-shrink-0 mt-0.5" />
          <span>Prices valid while stocks last. Images used are for illustrative purposes only. E&OE.</span>
        </div>

        {/* Product grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <SpecialCard key={item.id} item={item} originalPrice={item.products.price} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">No items in this promotion yet.</p>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('specials')}
            className="inline-flex items-center gap-2 btn-secondary"
          >
            View All Specials
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
