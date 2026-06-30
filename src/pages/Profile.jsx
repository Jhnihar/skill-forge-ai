import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';

const Profile = () => {
  const { userProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [switching, setSwitching] = useState(false);

  const handleSwitchMode = async () => {
    setSwitching(true);
    setMessage('');

    const newMode = userProfile.selectedMode === 'learn' ? 'build' : 'learn';

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        selectedMode: newMode
      });

      setMessage(`Success: Switched to ${newMode === 'learn' ? 'Learn' : 'Build'} Mode!`);
      
      // Refresh after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error switching mode:', error);
      setMessage('Error: Switching mode failed. Please try again.');
      setSwitching(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-8 md:p-12 relative z-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        <Breadcrumb />
        <h1 className="text-4xl font-extrabold mb-8 font-display">Profile Settings</h1>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-2xl border font-medium text-sm ${
              message.includes('Success') 
                ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400'
                : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Profile Info */}
        <motion.div variants={cardVariants} className="card mb-8 border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-2xl font-bold mb-6 font-display text-slate-850 dark:text-slate-100">Personal Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Full Name</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{userProfile?.name}</p>
            </div>
            
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Email Address</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200 break-all">{userProfile?.email}</p>
            </div>
            
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Member Since</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Mode Switcher */}
        <motion.div variants={cardVariants} className="card mb-8 border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 opacity-5 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <h2 className="text-2xl font-bold mb-6 font-display text-slate-850 dark:text-slate-100">Switch Workspace Mode</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-2xl font-extrabold text-primary-655 dark:text-primary-400 mb-2 font-display">
                {userProfile?.selectedMode === 'learn' ? '📚 Learn Mode active' : '💻 Build Mode active'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {userProfile?.selectedMode === 'learn' 
                  ? 'Currently master skills using adaptive quizzes and structured tests. Switch to Build mode to run code inside a Monaco editor.'
                  : 'Currently coding projects with instant AI explanations. Switch to Learn mode to complete quizzes and unlock certifications.'}
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwitchMode}
              disabled={switching}
              className="btn-secondary whitespace-nowrap self-start md:self-center disabled:opacity-55 disabled:cursor-not-allowed hover:shadow-sm"
            >
              {switching 
                ? 'Switching...' 
                : `Switch to ${userProfile?.selectedMode === 'learn' ? 'Build' : 'Learn'} Mode`}
            </motion.button>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              ⚠️ <strong>Important Note:</strong> Switching modes will change your layout and navigation settings. Each mode maintains separate tracking records, but your database document profile remains fully synced.
            </p>
          </div>
        </motion.div>

        {/* Completed Courses */}
        {userProfile?.selectedMode === 'learn' && (
          <motion.div variants={cardVariants} className="card mb-8 border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-2xl font-bold mb-6 font-display text-slate-850 dark:text-slate-100">Completed Courses</h2>
            {userProfile?.completedCourses && userProfile.completedCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userProfile.completedCourses.map((course, index) => {
                  const hasCertificate = course.accuracy >= 85;
                  return (
                    <motion.div 
                      key={index} 
                      whileHover={{ y: -3 }}
                      className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/55 rounded-2xl"
                    >
                      <div>
                        <h3 className="font-bold capitalize text-slate-850 dark:text-slate-100 font-display">{course.courseName}</h3>
                        <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
                          Completed: {new Date(course.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-primary-655 dark:text-primary-400 font-display">
                          {course.accuracy}%
                        </div>
                        {hasCertificate && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-full inline-flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-550 animate-pulse" />
                            Certificate
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 text-sm">
                No courses completed yet. Start learning and unlock certifications!
              </div>
            )}
          </motion.div>
        )}

        {/* Applied Jobs */}
        {userProfile?.selectedMode === 'learn' && (
          <motion.div variants={cardVariants} className="card border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-2xl font-bold mb-6 font-display text-slate-850 dark:text-slate-100">Applied Jobs</h2>
            {userProfile?.appliedJobs && userProfile.appliedJobs.length > 0 ? (
              <div className="space-y-4">
                {userProfile.appliedJobs.map((job, index) => (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/55 rounded-2xl"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display">{job.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{job.company}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Applied: {new Date(job.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      Under Review
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 text-sm">
                No job applications submitted yet. Master courses and unlock job posts!
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
