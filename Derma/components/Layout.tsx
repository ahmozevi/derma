import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, History, Home, Search, User, PhoneCall } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary' : 'text-gray-400 hover:text-gray-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation - Mobile First Sticky */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Derma</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/find-help" className="hidden sm:flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors">
              <PhoneCall className="w-4 h-4 mr-2" />
              Nurse on Call
            </Link>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-pb">
        <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>
        <Link to="/analyze" className={`flex flex-col items-center ${isActive('/analyze')}`}>
          <div className="bg-primary text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-slate-50">
             <Search className="w-6 h-6" />
          </div>
          <span className="text-[10px] mt-1 font-medium">Analyze</span>
        </Link>
        <Link to="/history" className={`flex flex-col items-center ${isActive('/history')}`}>
          <History className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">History</span>
        </Link>
      </nav>

      {/* Footer for Desktop */}
      <footer className="hidden sm:block bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Derma. For educational purposes only. Not a medical device.</p>
        </div>
      </footer>
    </div>
  );
};