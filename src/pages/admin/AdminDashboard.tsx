import { useEffect, useState } from 'react';
import { Tag, Package, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activePromotions: 0,
    totalSpecialItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      const [prodRes, promoRes, itemRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('promotions').select('id', { count: 'exact' }).eq('is_active', true).lte('valid_from', today).gte('valid_to', today),
        supabase.from('promotion_items').select('id', { count: 'exact' }),
      ]);
      setStats({
        totalProducts: prodRes.count || 0,
        activePromotions: promoRes.count || 0,
        totalSpecialItems: itemRes.count || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'bg-brand-blue', desc: 'Products in catalogue' },
    { label: 'Active Promotions', value: stats.activePromotions, icon: Tag, color: 'bg-brand-red', desc: 'Running this week' },
    { label: 'Promotional Items', value: stats.totalSpecialItems, icon: TrendingUp, color: 'bg-brand-green', desc: 'Across all promotions' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl text-neutral-800 mb-1">Welcome Back</h2>
        <p className="text-neutral-500">Manage your weekly specials, products, and promotions from here.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  <card.icon size={22} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-display font-black text-neutral-800 mb-1">{card.value}</p>
              <p className="font-semibold text-neutral-700 text-sm">{card.label}</p>
              <p className="text-neutral-400 text-xs">{card.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-display font-bold text-neutral-800 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Tag size={18} className="text-brand-red" />
              <h4 className="font-bold text-neutral-800 text-sm">Weekly Specials</h4>
            </div>
            <p className="text-sm text-neutral-500">Create or update this week's promotional specials, set prices, and manage validity dates.</p>
          </div>
          <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Package size={18} className="text-brand-blue" />
              <h4 className="font-bold text-neutral-800 text-sm">Product Catalogue</h4>
            </div>
            <p className="text-sm text-neutral-500">Add new products, update prices, and manage your product catalogue across all departments.</p>
          </div>
        </div>
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4 text-sm">
        <Calendar size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-neutral-800 mb-0.5">Setting up Weekly Specials</p>
          <p className="text-neutral-600">
            Go to <strong>Weekly Specials</strong> to create a new promotion. Set the validity dates, then add products with their special prices. Changes appear on the website immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
