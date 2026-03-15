import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';

import HomePage from './pages/HomePage';
import InstitutionsPage from './pages/InstitutionsPage';
import InstitutionDetailPage from './pages/InstitutionDetailPage';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage';
import StatsPage from './pages/StatsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/muassasalar" element={<InstitutionsPage />} />
              <Route path="/muassasalar/:id" element={<InstitutionDetailPage />} />
              <Route path="/xabar" element={<ReportPage />} />
              <Route path="/xarita" element={<MapPage />} />
              <Route path="/statistika" element={<StatsPage />} />
            </Routes>
          </main>
          
          <MobileNav />
        </div>
        
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'text-sm font-medium',
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
