import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Store } from '../lib/database.types';

const storeImages = [
  'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2292919/pexels-photo-2292919.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const storeColors = ['bg-brand-green', 'bg-brand-red'];
const storeTextColors = ['text-brand-green', 'text-brand-red'];
const storeAccents = ['border-brand-green', 'border-brand-red'];

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('stores').select('*').order('created_at').then(({ data }) => {
      setStores(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-blue py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <MapPin size={14} />
            Find Us
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl mb-2">Our Store Locations</h1>
          <p className="text-blue-200 text-lg">Two convenient locations serving the Durban community</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {stores.map((store, i) => (
              <div key={store.id} className={`card border-2 ${storeAccents[i % 2]} overflow-hidden`}>
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="h-56 md:h-auto overflow-hidden">
                    <img
                      src={storeImages[i % 2]}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8">
                    {/* Store name badge */}
                    <div className={`inline-flex items-center gap-2 ${storeColors[i % 2]} text-white px-4 py-2 rounded-xl mb-5`}>
                      <MapPin size={16} />
                      <span className="font-display font-black">{store.suburb}</span>
                    </div>

                    <h2 className={`font-display font-black text-2xl mb-5 ${storeTextColors[i % 2]}`}>
                      Premier<span className="italic">fresh</span> {store.suburb}
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={17} className="text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">Address</p>
                          <p className="font-semibold text-neutral-800">{store.address}</p>
                          <p className="text-neutral-500">{store.suburb}, Durban, KwaZulu-Natal</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone size={17} className="text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">Phone</p>
                          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className={`font-bold text-lg ${storeTextColors[i % 2]} hover:underline`}>
                            {store.phone}
                          </a>
                        </div>
                      </div>

                      {store.trading_hours && (
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock size={17} className="text-neutral-500" />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">Trading Hours</p>
                            {store.trading_hours.split('|').map((h, idx) => (
                              <p key={idx} className="text-neutral-700 text-sm">{h.trim()}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CreditCard size={17} className="text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">Payment Methods</p>
                          <div className="flex gap-2 mt-1">
                            <span className="bg-brand-blue text-white text-xs font-black px-2.5 py-1 rounded">VISA</span>
                            <span className="bg-neutral-800 text-white text-xs font-black px-2.5 py-1 rounded">MC</span>
                            <span className="bg-neutral-200 text-neutral-700 text-xs font-semibold px-2.5 py-1 rounded">Cash</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ' ' + store.suburb + ' Durban')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white transition-colors ${
                        i === 0 ? 'bg-brand-green hover:bg-brand-green-dark' : 'bg-brand-red hover:bg-brand-red-dark'
                      }`}
                    >
                      <MapPin size={16} />
                      Get Directions on Google Maps
                      <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
