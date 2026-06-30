import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Ambient background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary-400/10 to-accent-400/0 blur-[120px] dark:from-primary-900/20 dark:to-accent-900/0 animate-float-slow" />
        <div className="absolute top-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-accent-400/10 to-primary-400/0 blur-[130px] dark:from-accent-950/15 dark:to-primary-900/5 animate-float-medium" />
        <div className="absolute -bottom-[10%] left-[15%] w-[45%] h-[45%] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/0 blur-[100px] dark:from-purple-900/15 dark:to-pink-900/0 animate-float-slow" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-450 dark:to-accent-300 font-display">
                SkillForge AI
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-sm"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-655" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <Link to="/login" className="btn-secondary px-5 py-2.5 text-sm">
                Login
              </Link>
              
              <Link to="/signup" className="btn-primary px-5 py-2.5 text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight font-display">
              Learn or Build. <br />
              <span className="text-gradient">Choose Your Path.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-14 leading-relaxed max-w-3xl mx-auto"
          >
            SkillForge AI adapts to you. Master new technologies with interactive AI tests or build full applications inside our intelligent code workspace.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex gap-5 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/signup" className="btn-primary text-base px-8 py-4 block shadow-lg">
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/login" className="btn-secondary text-base px-8 py-4 block">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="card group border-slate-200/50 dark:border-slate-800/50 hover:shadow-[0_15px_30px_rgba(99,102,241,0.05)]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Adaptive AI Learning</h3>
            <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
              Our AI evaluates your understanding in real-time, tailoring study paths to your knowledge level. Skip what you know, focus on where you struggle.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="card group border-slate-200/50 dark:border-slate-800/50 hover:shadow-[0_15px_30px_rgba(6,182,212,0.05)]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Real-Time AI Code Mentor</h3>
            <p className="text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
              Build browser applications inside our Monaco-powered IDE. Receive automated lint analysis, code feedback, and explanations as you code.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="card group border-slate-200/50 dark:border-slate-800/50 hover:shadow-[0_15px_30px_rgba(236,72,153,0.05)]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Job-Ready Certification</h3>
            <p className="text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
              Pass tests with an 85%+ score to unlock verified competency certificates. Instantly search and submit applications for real jobs directly inside the app.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 mt-20 relative z-10 bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-slate-500 dark:text-slate-500 text-sm">
            © 2026 SkillForge AI. All rights reserved. Empowering next-generation builders.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
