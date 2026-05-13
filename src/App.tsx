import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SpecialsPage from './pages/SpecialsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import StoresPage from './pages/StoresPage';
import AdminPanel from './pages/admin/AdminPanel';

type Page = 'home' | 'specials' | 'departments' | 'stores' | 'admin';

function isAdminPath() {
  return window.location.pathname.startsWith('/admin');
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (isAdminPath()) return 'admin';
    const hash = window.location.hash.replace('#', '') as Page;
    const validPages: Page[] = ['home', 'specials', 'departments', 'stores'];
    return validPages.includes(hash) ? hash : 'home';
  });

  useEffect(() => {
    if (currentPage === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      window.history.pushState(null, '', `/${currentPage === 'home' ? '' : '#' + currentPage}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  function navigate(page: string) {
    setCurrentPage(page as Page);
  }

  if (currentPage === 'admin') {
    return <AdminPanel />;
  }

  const pageComponents: Record<Exclude<Page, 'admin'>, React.ReactNode> = {
    home: <HomePage onNavigate={navigate} />,
    specials: <SpecialsPage />,
    departments: <DepartmentsPage />,
    stores: <StoresPage />,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={navigate} onAdminLogin={() => navigate('admin')} />
      <main className="flex-1">
        {pageComponents[currentPage as Exclude<Page, 'admin'>] || <HomePage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
