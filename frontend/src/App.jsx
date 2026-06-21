import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout.jsx';

import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DocumentDetails from './pages/DocumentDetails.jsx';
import NotesPage from './pages/NotesPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import TutorPage from './pages/TutorPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  // DEBUG
  console.log('Current route:', location.pathname);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <motion.div {...pageTransition}>
                <Dashboard />
              </motion.div>
            }
          />

          <Route
            path="/documents/:id"
            element={
              <motion.div {...pageTransition}>
                <DocumentDetails />
              </motion.div>
            }
          />

          <Route
            path="/documents/:id/notes"
            element={
              <motion.div {...pageTransition}>
                <NotesPage />
              </motion.div>
            }
          />

          <Route
            path="/documents/:id/flashcards"
            element={
              <motion.div {...pageTransition}>
                <FlashcardsPage />
              </motion.div>
            }
          />

          <Route
            path="/documents/:id/quiz"
            element={
              <motion.div {...pageTransition}>
                <QuizPage />
              </motion.div>
            }
          />

          <Route
            path="/documents/:id/tutor"
            element={
              <motion.div {...pageTransition}>
                <TutorPage />
              </motion.div>
            }
          />

          <Route
            path="/settings"
            element={
              <motion.div {...pageTransition}>
                <SettingsPage />
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
    <Toaster
  theme="dark"
  position="top-center"
  richColors
  toastOptions={{
    duration: 8000,
    style: {
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#F8FAFC',
      padding: '16px',
      fontSize: '15px',
      maxWidth: '500px',
    }
  }}
/>

        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}