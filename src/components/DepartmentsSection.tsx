import { Leaf, Beef, Package, Cake, ChevronRight } from 'lucide-react';

interface DepartmentsSectionProps {
  onNavigate: (page: string) => void;
}

const departments = [
  {
    name: 'Fruit & Veg',
    slug: 'fruit-veg',
    description: 'Freshly sourced fruits and vegetables delivered daily. From crisp apples to exotic produce — always at their best.',
    icon: Leaf,
    bgColor: 'bg-brand-green',
    lightBg: 'bg-green-50',
    borderColor: 'border-brand-green',
    textColor: 'text-brand-green',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlights: ['Daily fresh deliveries', 'Local & seasonal produce', 'Best prices guaranteed'],
  },
  {
    name: 'Butchery',
    slug: 'butchery',
    description: 'Quality cuts of beef, lamb, pork, and chicken. Our skilled butchers ensure every cut is expertly prepared.',
    icon: Beef,
    bgColor: 'bg-brand-red',
    lightBg: 'bg-red-50',
    borderColor: 'border-brand-red',
    textColor: 'text-brand-red',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlights: ['Expert butchers on-site', 'Custom cuts available', 'Fresh & frozen options'],
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Everything you need for your pantry and home. Thousands of products from top brands at competitive prices.',
    icon: Package,
    bgColor: 'bg-brand-blue',
    lightBg: 'bg-blue-50',
    borderColor: 'border-brand-blue',
    textColor: 'text-brand-blue',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlights: ['Top local & imported brands', 'Household essentials', 'Baby & personal care'],
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    description: 'Freshly baked breads, rolls, cakes and pastries made in-store daily. Smell the freshness!',
    icon: Cake,
    bgColor: 'bg-brand-orange',
    lightBg: 'bg-amber-50',
    borderColor: 'border-brand-orange',
    textColor: 'text-brand-orange',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
    highlights: ['Baked fresh daily', 'Custom cakes & orders', 'Traditional & artisan breads'],
  },
];

export default function DepartmentsSection({ onNavigate }: DepartmentsSectionProps) {
  return (
    <section id="departments" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full text-sm font-bold mb-3">
            Our Departments
          </div>
          <h2 className="section-heading mb-3">Everything Under One Roof</h2>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">
            From farm-fresh produce to custom butchery cuts — Premier Fresh has all your shopping needs covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.slug}
              className={`card group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 ${dept.borderColor} border-opacity-0 hover:border-opacity-100 overflow-hidden`}
              onClick={() => onNavigate('departments')}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className={`flex-1 p-5 ${dept.lightBg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${dept.bgColor} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                      <dept.icon size={20} className="text-white" />
                    </div>
                    <h3 className={`font-display font-black text-xl ${dept.textColor}`}>{dept.name}</h3>
                  </div>

                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{dept.description}</p>

                  <ul className="space-y-1.5 mb-4">
                    {dept.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 text-sm text-neutral-700">
                        <div className={`w-1.5 h-1.5 rounded-full ${dept.bgColor}`} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <button className={`inline-flex items-center gap-1.5 text-sm font-bold ${dept.textColor} group-hover:gap-2.5 transition-all`}>
                    Shop Now <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
