import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
          <Camera size={24} />
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">NeuralCaption</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Link to="/history" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                History
              </Link>
              <Link to="/evaluate" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Evaluation
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors">
                  <Shield size={14} />
                  <span>Admin</span>
                </Link>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {user?.username}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
