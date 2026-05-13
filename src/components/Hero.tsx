import { ChevronDown, Tag, Leaf, Beef, Package, Cake } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const categories = [
    { icon: Leaf, label: 'Fruit & Veg', color: 'bg-brand-green', page: 'departments' },
    { icon: Beef, label: 'Butchery', color: 'bg-brand-red', page: 'departments' },
    { icon: Package, label: 'Grocery', color: 'bg-brand-blue', page: 'departments' },
    { icon: Cake, label: 'Bakery', color: 'bg-brand-orange', page: 'departments' },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-blue min-h-[92vh] flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-blue-light opacity-30" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-blue-dark opacity-40" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-brand-green opacity-10" />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Tag size={14} />
              Weekly Specials Now Live
            </div>

            <h1 className="font-display font-black text-white mb-4 leading-tight">
              <span className="block text-5xl md:text-6xl lg:text-7xl">Premier</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl text-brand-green italic">fresh</span>
            </h1>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-3xl md:text-4xl font-display font-black mb-8">
              <span className="text-brand-red">FRESHNESS.</span>
              <span className="text-brand-green">QUALITY.</span>
              <span className="text-brand-orange">VALUE.</span>
            </div>

            <p className="text-blue-100 text-lg mb-8 max-w-md leading-relaxed">
              Your neighbourhood supermarket serving Durban with the freshest produce, quality meats, and everyday essentials at unbeatable prices.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('specials')}
                className="btn-primary text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                View Weekly Specials
              </button>
              <button
                onClick={() => onNavigate('stores')}
                className="bg-white text-brand-blue font-display font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Find a Store
              </button>
            </div>
          </div>

          {/* Right - feature image area */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative">
              {/* Main circular display */}
              <div className="w-80 h-80 rounded-full bg-brand-teal flex items-center justify-center overflow-hidden shadow-2xl border-8 border-white/20">
                <img
                  src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fresh produce"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-brand-red text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="font-display font-black text-xl leading-none">UP</span>
                <span className="font-display font-black text-xl leading-none">TO</span>
                <span className="font-display font-black text-xs">50% OFF</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-brand-green text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="font-display font-black text-xs text-center leading-tight">FRESH DAILY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-12 lg:mt-16">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4">Shop by Department</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => onNavigate(cat.page)}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-xl px-4 py-3 transition-all duration-200"
              >
                <div className={`${cat.color} w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={18} className="text-white" />
                </div>
                <span className="font-semibold text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 pb-6 flex justify-center">
        <div className="animate-bounce text-white/50">
          <ChevronDown size={28} />
        </div>
      </div>
    </section>
  );
}
