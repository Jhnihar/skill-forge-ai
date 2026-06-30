import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Ambient background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary-400/10 to-accent-400/0 blur-[120px] dark:from-primary-900/15 dark:to-accent-900/0 animate-float-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-accent-400/10 to-primary-400/0 blur-[120px] dark:from-accent-950/15 dark:to-primary-900/5 animate-float-medium" />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-sm z-10"
      >
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="card max-w-md w-full relative z-10 border-slate-200/60 dark:border-slate-800/50 shadow-2xl p-8 backdrop-blur-xl"
      >
        <Link to="/" className="text-3xl font-extrabold text-center block mb-8 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-300 font-display">
          SkillForge AI
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center font-display text-slate-800 dark:text-slate-100">Welcome Back</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3.5 rounded-2xl mb-5 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-sm text-slate-600 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@domain.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm text-slate-600 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2 py-3.5"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
