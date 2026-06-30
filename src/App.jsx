import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Learn Mode Pages
import Courses from './pages/LearnMode/Courses';
import CourseTest from './pages/LearnMode/CourseTest';
import JobList from './pages/LearnMode/JobList';
import AppliedJobs from './pages/LearnMode/AppliedJobs';

// Build Mode Pages
import BuildWorkspace from './pages/BuildMode/BuildWorkspace';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isEmailVerified } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Protected Route with Layout
const ProtectedLayoutRoute = ({ children }) => {
  const { currentUser, isEmailVerified } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            <Route path="/dashboard" element={
              <ProtectedLayoutRoute>
                <Dashboard />
              </ProtectedLayoutRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedLayoutRoute>
                <Profile />
              </ProtectedLayoutRoute>
            } />
            
            {/* Learn Mode Routes */}
            <Route path="/courses" element={
              <ProtectedLayoutRoute>
                <Courses />
              </ProtectedLayoutRoute>
            } />
            
            <Route path="/courses/:courseName/test" element={
              <ProtectedLayoutRoute>
                <CourseTest />
              </ProtectedLayoutRoute>
            } />
            
            <Route path="/jobs" element={
              <ProtectedLayoutRoute>
                <JobList />
              </ProtectedLayoutRoute>
            } />
            
            <Route path="/applied-jobs" element={
              <ProtectedLayoutRoute>
                <AppliedJobs />
              </ProtectedLayoutRoute>
            } />
            
            {/* Build Mode Route */}
            <Route path="/build" element={
              <ProtectedRoute>
                <BuildWorkspace />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;