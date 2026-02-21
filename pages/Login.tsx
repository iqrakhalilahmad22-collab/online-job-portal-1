import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { MockApi } from '../services/mockApi';
import { Briefcase, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await MockApi.login(email, password);
        login(user);
        navigateBasedOnRole(user.role);
      } else {
        const user = await MockApi.register({
          name,
          email,
          password,
          role,
          companyName: role === UserRole.COMPANY ? companyName : undefined
        });
        login(user);
        navigateBasedOnRole(user.role);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const navigateBasedOnRole = (role: UserRole) => {
    switch (role) {
      case UserRole.COMPANY:
        navigate('/company-dashboard');
        break;
      case UserRole.ADMIN:
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg shadow-primary-500/30">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of professionals'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                <div className="mt-1 flex rounded-lg shadow-sm p-1 bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.SEEKER)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      role === UserRole.SEEKER 
                        ? 'bg-white text-primary-700 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.COMPANY)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      role === UserRole.COMPANY 
                        ? 'bg-white text-primary-700 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    Employer
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  />
                </div>
                {role === UserRole.COMPANY && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  {isLogin ? "New to Jobify?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};