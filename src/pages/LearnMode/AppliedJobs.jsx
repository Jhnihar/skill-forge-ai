import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../../components/Breadcrumb';
import { motion } from 'framer-motion';

const AppliedJobs = () => {
  const { userProfile } = useAuth();
  const appliedJobs = userProfile?.appliedJobs || [];

  if (appliedJobs.length === 0) {
    return (
      <div className="min-h-screen p-8 md:p-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb />
          <h1 className="text-4xl font-extrabold mb-8 font-display">Applied Jobs</h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card text-center py-16 px-8 border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center"
          >
            <div className="text-7xl mb-6 animate-float-medium">📋</div>
            <h2 className="text-2xl font-bold mb-3 font-display text-slate-800 dark:text-slate-200">No Applications Yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed text-sm">
              Complete courses with 85%+ accuracy to unlock certifications, browse job posts, and submit applications.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link to="/jobs" className="btn-primary inline-block text-xs font-bold px-8 py-3.5">
                Browse Job Opportunities
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb />
        <h1 className="text-4xl font-extrabold mb-2 font-display">Applied Jobs</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-10">
          Track and manage your submitted job applications in one place.
        </p>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-4"
        >
          {appliedJobs.map((job, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -2 }}
              className="card border-slate-200/50 dark:border-slate-800/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">{job.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{job.company}</p>
                  <p className="text-xs text-slate-550 dark:text-slate-500 mt-3 font-medium">
                    Submitted: {new Date(job.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40 rounded-xl text-xs font-semibold uppercase tracking-wider">
                    Under Review
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 card bg-gradient-to-r from-primary-500/5 to-accent-500/5 border-primary-200/50 dark:border-primary-900/30 p-6"
        >
          <h3 className="font-bold text-primary-700 dark:text-primary-300 mb-3 flex items-center gap-2 text-base font-display">
            <span>💡</span> Application Success Tips
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">• <span className="flex-1">Complete additional courses to strengthen your platform profile page.</span></li>
            <li className="flex items-start gap-2">• <span className="flex-1">Ensure your workspace submissions reflect clean code formatting.</span></li>
            <li className="flex items-start gap-2">• <span className="flex-1">Check back regularly as recruiter feedback is updated live.</span></li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AppliedJobs;
