import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, ShoppingCart, Leaf, Beef, Package, Cake, Lock } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAdminLogin?: () => void;
}

const departments = [
  { name: 'Fruit & Veg', slug: 'fruit-veg', icon: Leaf, color: 'text-brand-green' },
  { name: 'Butchery', slug: 'butchery', icon: Beef, color: 'text-brand-red' },
  { name: 'Grocery', slug: 'grocery', icon: Package, color: 'text-brand-blue' },
  { name: 'Bakery', slug: 'bakery', icon: Cake, color: 'text-brand-orange' },
];

export default function Navbar({ currentPage, onNavigate, onAdminLogin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Weekly Specials', page: 'specials' },
    { label: 'Departments', page: 'departments' },
    { label: 'Our Stores', page: 'stores' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-blue text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:0312620221" className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <Phone size={13} />
              <span>Reservoir Hills: 031 262 0221</span>
            </a>
            <a href="tel:0310011082" className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <Phone size={13} />
              <span>Bonela: 031 001 1082</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-brand-orange">
            <MapPin size={13} />
            <span>2 Convenient Locations in Durban</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''} bg-white border-b-4 border-brand-red`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="24" cy="24" r="22" stroke="#f5a623" strokeWidth="3" fill="white"/>
                  <circle cx="24" cy="24" r="17" stroke="#22a94b" strokeWidth="2.5" fill="none"/>
                  <circle cx="24" cy="24" r="11" stroke="#d81f26" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="6" fill="#f5a623"/>
                  <path d="M24 8 Q26 4 28 6" stroke="#22a94b" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-black text-xl md:text-2xl text-brand-blue">Premier</span>
                <span className="font-display font-black text-xl md:text-2xl text-brand-green italic">fresh</span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-brand-blue text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-brand-blue'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop departments dropdown hint */}
            <div className="hidden lg:flex items-center gap-3">
              {departments.map(dept => (
                <button
                  key={dept.slug}
                  onClick={() => onNavigate('departments')}
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-blue transition-colors"
                >
                  <dept.icon size={15} className={dept.color} />
                  <span>{dept.name}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-brand-blue text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <a href="tel:0312620221" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-blue font-medium">
                  <Phone size={15} /> 031 262 0221 (Reservoir Hills)
                </a>
                <a href="tel:0310011082" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-blue font-medium">
                  <Phone size={15} /> 031 001 1082 (Bonela)
                </a>
              </div>
              <div className="pt-2 border-t border-neutral-100">
                <button
                  onClick={() => { onAdminLogin?.(); setIsOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <Lock size={14} />
                  <span>Staff Login</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
