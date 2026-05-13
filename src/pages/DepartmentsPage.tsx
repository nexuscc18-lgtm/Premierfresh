import { useEffect, useState } from 'react';
import { Leaf, Beef, Package, Cake, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Department } from '../lib/database.types';

const departmentIcons: Record<string, React.ElementType> = {
  'fruit-veg': Leaf,
  'butchery': Beef,
  'grocery': Package,
  'bakery': Cake,
};

const departmentColors: Record<string, string> = {
  'fruit-veg': 'bg-brand-green text-white',
  'butchery': 'bg-brand-red text-white',
  'grocery': 'bg-brand-blue text-white',
  'bakery': 'bg-brand-orange text-white',
};

const deptBgLight: Record<string, string> = {
  'fruit-veg': 'bg-green-50 border-green-200',
  'butchery': 'bg-red-50 border-red-200',
  'grocery': 'bg-blue-50 border-blue-200',
  'bakery': 'bg-amber-50 border-amber-200',
};

const placeholders: Record<string, string> = {
  'fruit-veg': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
  'butchery': 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
  'grocery': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
  'bakery': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
};

interface ProductWithDept extends Product {
  departments: Department | null;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [products, setProducts] = useState<ProductWithDept[]>([]);
  const [activeDept, setActiveDept] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [deptRes, prodRes] = await Promise.all([
        supabase.from('departments').select('*').order('display_order'),
        supabase.from('products').select('*, departments(*)').eq('is_active', true),
      ]);
      setDepartments(deptRes.data || []);
      setProducts((prodRes.data as ProductWithDept[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = products.filter(p => {
    const matchesDept = activeDept === 'all' || p.departments?.slug === activeDept;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-blue py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-black text-white text-4xl md:text-5xl mb-2">Our Departments</h1>
          <p className="text-blue-200 text-lg">Freshness, quality and value in every aisle</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Department tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveDept('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeDept === 'all'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            All Products
          </button>
          {departments.map(dept => {
            const Icon = departmentIcons[dept.slug] || Package;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept.slug)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeDept === dept.slug
                    ? `${departmentColors[dept.slug]} shadow-md`
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Icon size={15} />
                {dept.name}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-500 mb-2">No products found</h3>
            <p className="text-neutral-400">Try a different department or search term.</p>
          </div>
        ) : (
          <>
            {/* Group by department when "all" is selected */}
            {activeDept === 'all' ? (
              departments.map(dept => {
                const deptProducts = filtered.filter(p => p.departments?.id === dept.id);
                if (deptProducts.length === 0) return null;
                const Icon = departmentIcons[dept.slug] || Package;
                return (
                  <div key={dept.id} className="mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-5 border ${deptBgLight[dept.slug]}`}>
                      <div className={`${departmentColors[dept.slug]} w-7 h-7 rounded-lg flex items-center justify-center`}>
                        <Icon size={14} />
                      </div>
                      <h2 className="font-display font-bold text-neutral-800">{dept.name}</h2>
                      <span className="text-neutral-400 text-sm">({deptProducts.length})</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {deptProducts.map(p => (
                        <ProductCard key={p.id} product={p} deptSlug={dept.slug} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} deptSlug={p.departments?.slug ?? 'grocery'} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, deptSlug }: { product: ProductWithDept; deptSlug: string }) {
  const imgSrc = product.image_url || placeholders[deptSlug] || placeholders['grocery'];
  return (
    <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="relative overflow-hidden h-40 bg-neutral-100">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
        {product.departments && (
          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${departmentColors[deptSlug]}`}>
            {product.departments.name}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold text-neutral-800 leading-tight mb-1">
          {product.weight && <span className="text-neutral-400 text-xs">{product.weight} </span>}
          {product.name}
        </p>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div className="price-tag text-brand-blue">
            <span className="text-xs align-super font-black">R</span>
            <span className="text-xl">{Math.floor(product.price)}</span>
            <span className="text-xs align-super">.{(product.price % 1).toFixed(2).slice(2)}</span>
          </div>
          <span className="text-xs text-neutral-400">{product.unit === 'kg' ? '/kg' : 'each'}</span>
        </div>
      </div>
    </div>
  );
}
