import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Using HashRouter in App, so this imports from react-router-dom
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Briefcase, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Users,
  Search
} from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive(to)
          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive(to) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0 shadow-xl z-20">
        <div className="p-6 flex items-center border-b border-slate-800">
          <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-500/30">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-white tracking-tight">Jobify</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          {user.role === UserRole.SEEKER && (
            <>
              <NavItem to="/dashboard" icon={Search} label="Find Jobs" />
              <NavItem to="/my-applications" icon={List} label="My Applications" />
              <NavItem to="/profile" icon={UserIcon} label="My Profile" />
            </>
          )}

          {user.role === UserRole.COMPANY && (
            <>
              <NavItem to="/company-dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/post-job" icon={PlusCircle} label="Post a Job" />
            </>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <NavItem to="/admin-dashboard" icon={LayoutDashboard} label="Overview" />
              <NavItem to="/admin-users" icon={Users} label="Manage Users" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center mb-4 px-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize truncate">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center">
           <div className="bg-primary-600 p-1.5 rounded-lg">
             <Briefcase className="h-5 w-5 text-white" />
           </div>
           <span className="ml-2 font-bold text-white text-lg">Jobify</span>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white">
          <LogOut className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-slate-50 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {user.role === UserRole.SEEKER && (
            <>
              <Link to="/dashboard" className={`p-2 rounded-lg ${isActive('/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><Search className="h-6 w-6"/></Link>
              <Link to="/my-applications" className={`p-2 rounded-lg ${isActive('/my-applications') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><List className="h-6 w-6"/></Link>
              <Link to="/profile" className={`p-2 rounded-lg ${isActive('/profile') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><UserIcon className="h-6 w-6"/></Link>
            </>
         )}
         {user.role === UserRole.COMPANY && (
            <>
              <Link to="/company-dashboard" className={`p-2 rounded-lg ${isActive('/company-dashboard') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><LayoutDashboard className="h-6 w-6"/></Link>
              <Link to="/post-job" className={`p-2 rounded-lg ${isActive('/post-job') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><PlusCircle className="h-6 w-6"/></Link>
            </>
         )}
         {user.role === UserRole.ADMIN && (
            <>
              <Link to="/admin-dashboard" className={`p-2 rounded-lg ${isActive('/admin-dashboard') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><LayoutDashboard className="h-6 w-6"/></Link>
              <Link to="/admin-users" className={`p-2 rounded-lg ${isActive('/admin-users') ? 'text-primary-600 bg-primary-50' : 'text-slate-400'}`}><Users className="h-6 w-6"/></Link>
            </>
         )}
      </div>
    </div>
  );
};