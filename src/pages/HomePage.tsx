import Hero from '../components/Hero';
import WeeklySpecials from '../components/WeeklySpecials';
import DepartmentsSection from '../components/DepartmentsSection';
import StoresSection from '../components/StoresSection';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <WeeklySpecials onNavigate={onNavigate} />
      <DepartmentsSection onNavigate={onNavigate} />
      <StoresSection />
    </>
  );
}
