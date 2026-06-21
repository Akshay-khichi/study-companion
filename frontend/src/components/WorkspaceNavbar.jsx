import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkspaceNavbar() {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1400px] z-50">
      <nav className="bg-surface/60 backdrop-blur-xl border border-border rounded-full shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <span className="font-semibold text-base tracking-tight">Study Companion</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1 bg-background/30 rounded-full p-1">
            <NavLink to="/dashboard">Workspace</NavLink>
            <NavLink to="/dashboard">Materials</NavLink>
            <NavLink to="/dashboard">Tutor</NavLink>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/dashboard" className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors">
              Open Dashboard
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-sm text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-white/5">
    {children}
  </Link>
);