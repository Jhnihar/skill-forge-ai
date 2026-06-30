import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/BackButton';
import Breadcrumb from '../../components/Breadcrumb';
import { motion } from 'framer-motion';

// Predefined courses - static list in code
const AVAILABLE_COURSES = [
  {
    id: 'python',
    name: 'Python Programming',
    description: 'Master Python fundamentals, loops, list comprehensions, and functions with AI coaching.',
    icon: '🐍',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500',
    btnColor: 'hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-500/30'
  },
  {
    id: 'html',
    name: 'HTML5 Essentials',
    description: 'Learn the architectural foundations of modern web layouts and semantic structure tags.',
    icon: '🌐',
    color: 'from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-500',
    btnColor: 'hover:from-orange-600 hover:to-red-600 focus:ring-orange-500/30'
  },
  {
    id: 'css',
    name: 'Modern CSS Styling',
    description: 'Style responsive webpages with Flexbox, grids, specificity controls, and z-index ordering.',
    icon: '🎨',
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500',
    btnColor: 'hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500/30'
  }
];

const Courses = () => {
  const { userProfile } = useAuth();

  const isCourseCompleted = (courseId) => {
    return userProfile?.completedCourses?.some(course => course.courseName === courseId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className="p-8 md:p-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <BackButton className="!px-3 !py-1.5 !text-xs !bg-white/80 dark:!bg-slate-900/60 border border-slate-200 dark:border-slate-800" />
          <Breadcrumb />
        </div>
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2 font-display">Available Courses</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose a subject path to take adaptive tests and earn verified certifications.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6"
        >
          {AVAILABLE_COURSES.map((course) => {
            const completed = isCourseCompleted(course.id);
            const completedCourse = userProfile?.completedCourses?.find(
              c => c.courseName === course.id
            );

            return (
              <motion.div 
                key={course.id} 
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="card relative overflow-hidden flex flex-col justify-between border-slate-200/50 dark:border-slate-800/50 group"
              >
                {/* Ambient Top Background Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${course.color.split(' ')[0]} ${course.color.split(' ')[1]} opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 self-start">{course.icon}</div>
                  <h2 className="text-2xl font-bold mb-3 font-display text-slate-800 dark:text-slate-100">{course.name}</h2>
                  <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {course.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto">
                  {completed ? (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200/80 dark:border-green-900/50 rounded-2xl text-green-700 dark:text-green-400 font-bold text-sm">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Completed: {completedCourse?.accuracy}% Score
                      </div>
                      <Link
                        to={`/courses/${course.id}/test`}
                        className="btn-secondary w-full text-center block py-3 text-xs"
                      >
                        Retake Course Test
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/courses/${course.id}/test`}
                      className="btn-primary w-full text-center block py-3 text-xs"
                    >
                      Start Adaptive Learning
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Completed Courses Summary Progress */}
        {userProfile?.completedCourses && userProfile.completedCourses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6 font-display border-b border-slate-200 dark:border-slate-800 pb-2">Your Progress History</h2>
            <div className="card border-slate-200/50 dark:border-slate-800/50">
              <div className="grid md:grid-cols-2 gap-4">
                {userProfile.completedCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                    <div>
                      <h3 className="font-bold capitalize text-slate-800 dark:text-slate-200 font-display">{course.courseName} Test</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Earned: {new Date(course.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400 font-display">
                        {course.accuracy}%
                      </div>
                      {course.accuracy >= 85 ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-900/40 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Certificate
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-semibold text-slate-500">
                          Complete Score
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
