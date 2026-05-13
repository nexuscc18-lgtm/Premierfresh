import { Phone, MapPin, Mail, Leaf, Beef, Package, Cake } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="24" cy="24" r="22" stroke="#f5a623" strokeWidth="3" fill="transparent"/>
                  <circle cx="24" cy="24" r="17" stroke="#22a94b" strokeWidth="2.5" fill="none"/>
                  <circle cx="24" cy="24" r="11" stroke="#d81f26" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="6" fill="#f5a623"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-black text-xl text-white">Premier</span>
                <span className="font-display font-black text-xl text-brand-green italic">fresh</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your neighbourhood supermarket delivering freshness, quality, and value to the Durban community.
            </p>
            <div className="flex gap-2 text-xs font-bold">
              <span className="text-brand-red">FRESHNESS.</span>
              <span className="text-brand-green">QUALITY.</span>
              <span className="text-brand-orange">VALUE.</span>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Departments</h4>
            <ul className="space-y-2.5">
              {[
                { icon: Leaf, label: 'Fruit & Veg', color: 'text-brand-green' },
                { icon: Beef, label: 'Butchery', color: 'text-brand-red' },
                { icon: Package, label: 'Grocery', color: 'text-brand-blue-light' },
                { icon: Cake, label: 'Bakery', color: 'text-brand-orange' },
              ].map(item => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate('departments')}
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <item.icon size={14} className={item.color} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Weekly Specials', page: 'specials' },
                { label: 'Our Stores', page: 'stores' },
              ].map(item => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Our Stores</h4>
            <div className="space-y-4">
              <div>
                <p className="text-white text-sm font-semibold mb-1">Reservoir Hills</p>
                <div className="flex items-start gap-1.5 text-sm mb-1">
                  <MapPin size={12} className="flex-shrink-0 mt-0.5 text-brand-green" />
                  <span>610 Mountbatten Drive</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Phone size={12} className="text-brand-green" />
                  <a href="tel:0312620221" className="hover:text-white transition-colors">031 262 0221</a>
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-1">Bonela</p>
                <div className="flex items-start gap-1.5 text-sm mb-1">
                  <MapPin size={12} className="flex-shrink-0 mt-0.5 text-brand-red" />
                  <span>128 Candella Road</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Phone size={12} className="text-brand-red" />
                  <a href="tel:0310011082" className="hover:text-white transition-colors">031 001 1082</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>&copy; {year} Premier Fresh (Pty) Ltd. All rights reserved.</p>
          <p>Prices valid while stocks last. E&OE.</p>
        </div>
      </div>
    </footer>
  );
}
