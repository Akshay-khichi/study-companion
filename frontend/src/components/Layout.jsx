import { Outlet, useLocation } from 'react-router-dom';
import LandingNavbar from './LandingNavbar.jsx';

export default function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.includes('/notes') ||
    location.pathname.includes('/flashcards') ||
    location.pathname.includes('/quiz') ||
    location.pathname.includes('/tutor');

  return (
    <div className="min-h-screen bg-background">

      {!hideNavbar && <LandingNavbar />}

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

    </div>
  );
}