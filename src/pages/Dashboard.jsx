import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const isLearnMode = userProfile?.selectedMode === 'learn';

  const stats = [
    {
      title: 'Current Mode',
      value: isLearnMode ? 'Learn' : 'Build',
      desc: isLearnMode ? 'Adaptive Courses' : 'IDE Playground',
      icon: isLearnMode ? '📚' : '💻',
      color: 'from-violet-500 to-indigo-500'
    },
    {
      title: isLearnMode ? 'Completed Courses' : 'Projects Completed',
      value: userProfile?.completedCourses?.length || 0,
      desc: isLearnMode ? 'Certified skills' : 'Coded drafts',
      icon: isLearnMode ? '🏆' : '📂',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: isLearnMode ? 'Applied Jobs' : 'Active Sessions',
      value: userProfile?.appliedJobs?.length || 0,
      desc: isLearnMode ? 'Job applications' : 'AI tutoring chats',
      icon: isLearnMode ? '💼' : '⚡',
      color: 'from-pink-500 to-purple-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="p-8 md:p-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 font-display">
            Welcome, <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-300">{userProfile?.name}</span>! 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {isLearnMode 
              ? 'Ready to learn something new? Choose a course to get started!'
              : 'Ready to build? Start a new project or get help with existing code!'}
          </p>
        </motion.div>
        
        {/* Quick Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card relative overflow-hidden group border-slate-200/50 dark:border-slate-800/50"
            >
              {/* Corner Ambient Glow */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1.5 font-display">
                {stat.value}
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 font-display border-b border-slate-200 dark:border-slate-800 pb-2">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {isLearnMode ? (
              <>
                <Link to="/courses" className="group">
                  <div className="card h-full border-slate-200/50 dark:border-slate-800/50 group-hover:border-primary-500/40 hover:shadow-[0_12px_24px_rgba(99,102,241,0.05)] transition-all duration-300 transform-gpu group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">📚</span>
                      <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Browse Courses</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Start learning Python, HTML, or CSS with adaptive AI tests and level up your skills.
                    </p>
                  </div>
                </Link>
                
                <Link to="/jobs" className="group">
                  <div className="card h-full border-slate-200/50 dark:border-slate-800/50 group-hover:border-accent-500/40 hover:shadow-[0_12px_24px_rgba(6,182,212,0.05)] transition-all duration-300 transform-gpu group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-accent-100 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform duration-300">💼</span>
                      <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">View Jobs</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Browse available job opportunities, see requirements, and apply with your course credentials.
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/build?mode=build" className="group">
                  <div className="card h-full border-slate-200/50 dark:border-slate-800/50 group-hover:border-primary-500/40 hover:shadow-[0_12px_24px_rgba(99,102,241,0.05)] transition-all duration-300 transform-gpu group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">💻</span>
                      <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Start Building</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Create new sandbox web applications inside our Monaco-powered code editor with active AI help.
                    </p>
                  </div>
                </Link>
                
                <Link to="/build?mode=debug" className="group">
                  <div className="card h-full border-slate-200/50 dark:border-slate-800/50 group-hover:border-accent-500/40 hover:shadow-[0_12px_24px_rgba(6,182,212,0.05)] transition-all duration-300 transform-gpu group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-accent-100 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform duration-300">🔧</span>
                      <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Debug Code</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Analyze a preloaded buggy project or insert code clips to get instant linting reports from AI.
                    </p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
