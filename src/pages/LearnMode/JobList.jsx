import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/BackButton';
import Breadcrumb from '../../components/Breadcrumb';
import { motion } from 'framer-motion';

// Static job listings - hardcoded
const AVAILABLE_JOBS = [
  {
    id: 'frontend-intern',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Remote',
    type: 'Internship',
    description: 'Join our team to build modern web applications using React and Tailwind CSS.',
    requirements: ['HTML', 'CSS', 'JavaScript basics'],
    salary: '$15-20/hour'
  },
  {
    id: 'python-dev',
    title: 'Python Developer',
    company: 'DataFlow Inc',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'Work on data processing pipelines and automation scripts using Python.',
    requirements: ['Python', 'Problem solving', 'SQL knowledge'],
    salary: '$60,000-80,000/year'
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    company: 'Creative Designs Studio',
    location: 'On-site',
    type: 'Full-time',
    description: 'Create beautiful, responsive websites for clients using HTML, CSS, and JavaScript.',
    requirements: ['HTML', 'CSS', 'Responsive design'],
    salary: '$50,000-70,000/year'
  }
];

const JobList = () => {
  const { userProfile } = useAuth();
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState('');

  const hasCompletedCourse = (courseName) => {
    return userProfile?.completedCourses?.some(
      course => course.courseName.toLowerCase() === courseName.toLowerCase() && course.accuracy >= 85
    );
  };

  const hasApplied = (jobId) => {
    return userProfile?.appliedJobs?.some(job => job.jobId === jobId);
  };

  const handleApply = async (job) => {
    setApplying(job.id);
    setMessage('');

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        appliedJobs: arrayUnion({
          jobId: job.id,
          title: job.title,
          company: job.company,
          appliedAt: new Date().toISOString()
        })
      });

      setMessage(`Success: Applied to ${job.title}!`);
      
      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error applying for job:', error);
      setMessage('Error: Applying for job failed. Please try again.');
    } finally {
      setApplying(null);
    }
  };

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
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-8 md:p-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <BackButton className="!px-3 !py-1.5 !text-xs !bg-white/80 dark:!bg-slate-900/60 border border-slate-200 dark:border-slate-800" />
          <Breadcrumb />
        </div>
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2 font-display">Job Opportunities</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete courses with 85%+ accuracy to unlock job applications.
          </p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl border font-medium text-sm ${
              message.includes('Success') 
                ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400'
                : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
            }`}
          >
            {message}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {AVAILABLE_JOBS.map((job) => {
            const alreadyApplied = hasApplied(job.id);
            const canApply = job.requirements.every(req => 
              hasCompletedCourse(req.toLowerCase())
            );

            return (
              <motion.div 
                key={job.id} 
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="card border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">{job.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-sm mt-1">{job.company}</p>
                  </div>
                  <div className="flex flex-row md:flex-col md:items-end gap-2 items-center">
                    <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200/55 dark:border-primary-900/40 rounded-full text-xs font-bold uppercase tracking-wider">
                      {job.type}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{job.location}</p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {job.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-widest mb-3">Requirements:</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {job.requirements.map((req, index) => {
                      const completed = hasCompletedCourse(req.toLowerCase());
                      return (
                        <span
                          key={index}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all duration-300 ${
                            completed
                              ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200/60 dark:border-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {req}
                          {completed && ' ✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/40 dark:border-slate-800/50 pt-5 mt-4">
                  <div className="text-xl font-extrabold text-primary-600 dark:text-primary-400 font-display">
                    {job.salary}
                  </div>

                  {alreadyApplied ? (
                    <button disabled className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl text-xs font-semibold cursor-not-allowed">
                      Already Applied ✓
                    </button>
                  ) : canApply ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApply(job)}
                      disabled={applying === job.id}
                      className="btn-primary !px-5 !py-2.5 !text-xs disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                      {applying === job.id ? 'Applying...' : 'Apply Now'}
                    </motion.button>
                  ) : (
                    <button disabled className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 rounded-2xl text-xs font-semibold cursor-not-allowed">
                      Complete Required Courses (85%+)
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default JobList;
