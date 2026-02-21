import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Layout
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login';
import { JobSearch } from './pages/seeker/JobSearch';
import { MyApplications } from './pages/seeker/MyApplications';
import { Profile } from './pages/seeker/Profile';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { PostJob } from './pages/company/PostJob';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard
    if (user.role === UserRole.COMPANY) return <Navigate to="/company-dashboard" />;
    if (user.role === UserRole.ADMIN) return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Seeker Routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
                <JobSearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
             path="/profile" 
             element={
               <ProtectedRoute allowedRoles={[UserRole.SEEKER]}>
                 <Profile />
               </ProtectedRoute>
             } 
          />

          {/* Company Routes */}
          <Route 
            path="/company-dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-job" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.COMPANY]}>
                <PostJob />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-users" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard /> 
              </ProtectedRoute>
            } 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;