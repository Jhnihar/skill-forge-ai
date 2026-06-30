import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [resendCooldown, setResendCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);

  const checkVerificationStatus = async () => {
    if (!currentUser) {
      return false;
    }

    try {
      const refreshedUser = await refreshCurrentUser();

      if (refreshedUser?.emailVerified) {
        navigate('/dashboard', { replace: true });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    if (currentUser.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser || currentUser.emailVerified) {
      return undefined;
    }

    let isMounted = true;

    const runCheck = async () => {
      if (!isMounted) {
        return;
      }

      const verified = await checkVerificationStatus();
      if (verified) {
        return;
      }
    };

    runCheck();

    const timer = setInterval(runCheck, 5000);
    const handleFocus = () => {
      runCheck();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [currentUser, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setResendCooldown((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!currentUser || resendCooldown > 0) {
      return;
    }

    setStatusMessage('');

    try {
      await sendEmailVerification(currentUser);
      setResendCooldown(30);
      setStatusMessage('Verification email sent.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setStatusMessage('Unable to resend right now. Please try again later.');
    }
  };

  const handleContinue = async () => {
    if (!currentUser) {
      return;
    }

    setCheckingVerification(true);
    setStatusMessage('');

    try {
      const verified = await checkVerificationStatus();

      if (verified) {
        return;
      }

      setStatusMessage('Still not verified — check your inbox or spam folder.');
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
      setStatusMessage('Unable to check verification status right now.');
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const emailLabel = currentUser?.email ?? 'your registered email address';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary-400/10 to-accent-400/0 blur-[120px] dark:from-primary-900/15 dark:to-accent-900/0 animate-float-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-accent-400/10 to-primary-400/0 blur-[120px] dark:from-accent-950/15 dark:to-primary-900/5 animate-float-medium" />
      </div>

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
        className="card max-w-lg w-full relative z-10 border-slate-200/60 dark:border-slate-800/50 shadow-2xl p-8 backdrop-blur-xl"
      >
        <Link to="/" className="text-3xl font-extrabold text-center block mb-6 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-300 font-display">
          SkillForge AI
        </Link>

        <h2 className="text-2xl font-bold mb-4 text-center font-display text-slate-800 dark:text-slate-100">
          Verify Your Email
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-6">
          We sent a verification link to <span className="font-semibold text-slate-800 dark:text-slate-200">{emailLabel}</span>. Open your inbox and click the link to continue.
        </p>

        {statusMessage && (
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3.5 rounded-2xl mb-5 text-sm font-medium">
            {statusMessage}
          </div>
        )}

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleResend}
            disabled={!currentUser || resendCooldown > 0}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3.5"
          >
            {resendCooldown > 0 ? `Resend verification email (${resendCooldown}s)` : 'Resend verification email'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleContinue}
            disabled={!currentUser || checkingVerification}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingVerification ? 'Checking status...' : "I've verified, continue"}
          </motion.button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm">
          <button
            type="button"
            onClick={handleLogout}
            className="font-semibold text-red-650 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
          >
            Log out
          </button>

          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;