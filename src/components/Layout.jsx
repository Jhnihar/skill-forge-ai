import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { userProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const learnModeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Courses', path: '/courses', icon: '📚' },
    { name: 'Job List', path: '/jobs', icon: '💼' },
    { name: 'Applied Jobs', path: '/applied-jobs', icon: '✅' },
    { name: 'Profile', path: '/profile', icon: '👤' }
  ];

  const buildModeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Build Workspace', path: '/build', icon: '💻' },
    { name: 'Profile', path: '/profile', icon: '👤' }
  ];

  const links = userProfile?.selectedMode === 'learn' ? learnModeLinks : buildModeLinks;

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Ambient background glow blobs for interior pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-primary-400/5 to-accent-400/0 blur-[100px] dark:from-primary-900/10 dark:to-accent-900/0" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-accent-400/5 to-primary-400/0 blur-[120px] dark:from-accent-950/10 dark:to-primary-900/5" />
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-10
        w-72 bg-white/80 dark:bg-slate-950/80 border-r border-slate-200/50 dark:border-slate-900/50
        backdrop-blur-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b border-slate-200/40 dark:border-slate-900/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-300 font-display">
              SkillForge AI
            </h1>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 border border-primary-100/50 dark:border-primary-900/50 text-primary-700 dark:text-primary-400">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              {userProfile?.selectedMode === 'learn' ? 'Learn Mode' : 'Build Mode'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6 space-y-2.5 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group border ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/5 border-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' 
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-250'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl transition-transform group-hover:scale-110 duration-300">{link.icon}</span>
                <span className="font-medium text-sm">{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-6 border-t border-slate-200/40 dark:border-slate-900/50 space-y-2.5">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all text-sm font-medium"
            >
              <span>{isDark ? '☀️' : '🌙'}</span>
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent text-red-650 dark:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-950/20 transition-all text-sm font-semibold"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Top Header */}
        <header className="lg:flex hidden sticky top-0 z-30 bg-white/40 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-900/50 backdrop-blur-md px-10 py-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold font-display">
                Welcome back, {userProfile?.name}! 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {userProfile?.selectedMode === 'learn' 
                  ? 'Continue your learning journey' 
                  : 'Build something amazing today'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick display of mode */}
              <div className="px-4 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {userProfile?.selectedMode === 'learn' ? '📚 Learn Mode' : '💻 Build Mode'}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-sm"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content with Motion Transitions */}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-950 z-30 pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
