import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInstitutes from './pages/admin/AdminInstitutes';
import AdminJobs from './pages/admin/AdminJobs';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import InstituteJobs from './pages/institute/InstituteJobs';
import InstituteApplications from './pages/institute/InstituteApplications';
import InstituteProfile from './pages/institute/InstituteProfile';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateJobs from './pages/candidate/CandidateJobs';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateResumes from './pages/candidate/CandidateResumes';
import CandidateProfile from './pages/candidate/CandidateProfile';
import HomePage from './pages/HomePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0) {
    const hasAccess = roles.some((role) => hasRole(role));
    if (!hasAccess) return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Default redirect */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/institutes" element={<ProtectedRoute roles={['ADMIN']}><AdminInstitutes /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute roles={['ADMIN']}><AdminJobs /></ProtectedRoute>} />

        {/* Institute Routes */}
        <Route path="/institute/dashboard" element={<ProtectedRoute roles={['INSTITUTE']}><InstituteDashboard /></ProtectedRoute>} />
        <Route path="/institute/jobs" element={<ProtectedRoute roles={['INSTITUTE']}><InstituteJobs /></ProtectedRoute>} />
        <Route path="/institute/applications" element={<ProtectedRoute roles={['INSTITUTE']}><InstituteApplications /></ProtectedRoute>} />
        <Route path="/institute/profile" element={<ProtectedRoute roles={['INSTITUTE']}><InstituteProfile /></ProtectedRoute>} />

        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterJobs /></ProtectedRoute>} />
        <Route path="/recruiter/applications" element={<ProtectedRoute roles={['RECRUITER']}><RecruiterApplications /></ProtectedRoute>} />

        {/* Candidate Routes */}
        <Route path="/candidate/dashboard" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateDashboard /></ProtectedRoute>} />
        <Route path="/candidate/jobs" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateJobs /></ProtectedRoute>} />
        <Route path="/candidate/applications" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateApplications /></ProtectedRoute>} />
        <Route path="/candidate/resumes" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateResumes /></ProtectedRoute>} />
        <Route path="/candidate/profile" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateProfile /></ProtectedRoute>} />
      </Route>

      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const RoleBasedRedirect: React.FC = () => {
  const { hasRole } = useAuth();

  if (hasRole('ADMIN')) return <Navigate to="/admin/dashboard" replace />;
  if (hasRole('INSTITUTE')) return <Navigate to="/institute/dashboard" replace />;
  if (hasRole('RECRUITER')) return <Navigate to="/recruiter/dashboard" replace />;
  if (hasRole('CANDIDATE')) return <Navigate to="/candidate/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default App;
