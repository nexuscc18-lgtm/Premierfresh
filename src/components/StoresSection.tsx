import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Store } from '../lib/database.types';

export default function StoresSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('stores').select('*').order('created_at').then(({ data }) => {
      setStores(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <section id="stores" className="py-16 bg-brand-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-3">
            <MapPin size={14} />
            Our Locations
          </div>
          <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-3">Find a Premier Fresh Near You</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Two convenient stores serving the Durban community with freshness, quality and value.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((store, i) => (
              <div key={store.id} className="bg-white rounded-2xl overflow-hidden shadow-xl">
                {/* Store header */}
                <div className={`${i === 0 ? 'bg-brand-green' : 'bg-brand-red'} p-5`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-black text-white text-xl leading-tight">
                        Premier<span className="italic">fresh</span>
                      </h3>
                      <p className="text-white/90 font-semibold text-lg mt-0.5">{store.suburb}</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-2.5">
                      <MapPin size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Store details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-800">{store.address}</p>
                      <p className="text-neutral-500">{store.suburb}, Durban</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-neutral-400 flex-shrink-0" />
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
                      {store.phone}
                    </a>
                  </div>

                  {store.trading_hours && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-600">
                        {store.trading_hours.split('|').map((h, idx) => (
                          <p key={idx}>{h.trim()}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-neutral-400 flex-shrink-0" />
                    <p className="text-sm text-neutral-600">Visa, Mastercard & Cash accepted</p>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ' ' + store.suburb + ' Durban')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white transition-all duration-200 mt-2 ${
                      i === 0 ? 'bg-brand-green hover:bg-brand-green-dark' : 'bg-brand-red hover:bg-brand-red-dark'
                    }`}
                  >
                    <MapPin size={16} />
                    Get Directions
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment methods strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80 text-sm">
          <span className="font-semibold text-white">Accepted Payments:</span>
          <div className="flex items-center gap-3">
            <div className="bg-white text-brand-blue font-black text-xs px-3 py-1.5 rounded-lg">VISA</div>
            <div className="bg-white text-neutral-800 font-black text-xs px-3 py-1.5 rounded-lg">Mastercard</div>
            <div className="bg-white text-neutral-600 font-semibold text-xs px-3 py-1.5 rounded-lg">Cash</div>
          </div>
        </div>
      </div>
    </section>
  );
}
