import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminPromotions from './AdminPromotions';
import type { User } from '@supabase/supabase-js';

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={() => {}} />;
  }

  const pageComponents: Record<string, React.ReactNode> = {
    dashboard: <AdminDashboard />,
    promotions: <AdminPromotions />,
    products: <AdminProducts />,
  };

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={() => setUser(null)}
    >
      {pageComponents[activePage] || <AdminDashboard />}
    </AdminLayout>
  );
}
