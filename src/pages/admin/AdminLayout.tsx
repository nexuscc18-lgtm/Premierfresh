import { useState } from 'react';
import { LogOut, Tag, Package, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'promotions', label: 'Weekly Specials', icon: Tag },
  { id: 'products', label: 'Products', icon: Package },
];

export default function AdminLayout({ children, activePage, onNavigate, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-blue z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="24" cy="24" r="22" stroke="#f5a623" strokeWidth="3" fill="transparent"/>
                  <circle cx="24" cy="24" r="15" stroke="#22a94b" strokeWidth="2.5" fill="none"/>
                  <circle cx="24" cy="24" r="6" fill="#f5a623"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div>
                  <span className="font-display font-black text-white text-base">Premier</span>
                  <span className="font-display font-black text-brand-green text-base italic">fresh</span>
                </div>
                <div className="text-white/50 text-xs -mt-0.5">Admin Portal</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activePage === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {activePage === item.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="lg:block">
            <h1 className="font-display font-bold text-neutral-800">
              {navItems.find(n => n.id === activePage)?.label || 'Admin'}
            </h1>
          </div>
          <div className="text-sm text-neutral-400 hidden sm:block">Premier Fresh Admin</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
