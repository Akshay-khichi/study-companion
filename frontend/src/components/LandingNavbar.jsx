import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function LandingNavbar() {
  const location = useLocation();

  const isDashboard =
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/documents');

  return (
   <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[75%] max-w-[1100px] z-50">
      <nav className="bg-surface/60 backdrop-blur-xl border border-border rounded-full shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3">
          
          <Link to="/" className="flex items-center space-x-2">
            {/* <BookOpen className="h-5 w-5 text-accent" /> */}
            <span className="font-semibold text-base tracking-tight text-white">
              Study Companion 
            </span>
          </Link>
{!isDashboard && (
  <div className="hidden md:flex items-center space-x-8">
    <a
      href="#workflow"
      className="text-sm text-secondary hover:text-white transition-colors"
    >
      Workflow
    </a>

    <a
      href="#features"
      className="text-sm text-secondary hover:text-white transition-colors"
    >
      Notes
    </a>
  </div>
)}

          <Link
            to={isDashboard ? '/' : '/dashboard'}
            className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            {isDashboard ? 'Home' : 'Dashboard'}
          </Link>

        </div>
      </nav>
    </header>
  );
}