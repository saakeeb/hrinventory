import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { useAuth } from '@/useAuth';
import { User } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['worker', 'manager', 'owner']),
  companyName: z.string().min(1, 'Company name is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;

interface AuthResponse {
  user: User;
}

interface Company {
  id: number;
  name: string;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: signupErrors }, setValue: setSignupValue, watch } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'worker', companyName: '' }
  });

  const selectedCompanyName = watch('companyName');

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => api.get('/companies').then(res => res.data),
    enabled: !isLogin
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginFormInputs>({
    mutationFn: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
    onSuccess: (data) => {
      login(data.user);
      navigate(from, { replace: true });
    },
  });

  const signupMutation = useMutation<AuthResponse, Error, SignupFormInputs>({
    mutationFn: (data) => api.post('/auth/register', data).then(res => res.data),
    onSuccess: (data) => {
      login(data.user);
      navigate(from, { replace: true });
    },
  });

  const onLoginSubmit = (data: LoginFormInputs) => loginMutation.mutate(data);
  const onSignupSubmit = (data: SignupFormInputs) => signupMutation.mutate(data);

  const isLoading = loginMutation.isPending || signupMutation.isPending;
  const serverError = loginMutation.error?.message || signupMutation.error?.message;

  return (
    <div className="min-h-screen flex items-center justify-center mesh-gradient p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="glass-card p-10 rounded-[2.5rem] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/10">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-2xl ring-8 ring-white/5 animate-pulse-slow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              HR<span className="text-indigo-400">-</span>Inventory
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide font-sans italic">
              {isLogin ? 'Accelerate your workforce momentum' : 'Join the mission management revolution'}
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 ring-1 ring-white/10 backdrop-blur-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${isLogin ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] text-indigo-950' : 'text-white/50 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${!isLogin ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] text-indigo-950' : 'text-white/50 hover:text-white'}`}
            >
              Join Up
            </button>
          </div>

          <form onSubmit={isLogin ? handleSubmitLogin(onLoginSubmit) : handleSubmitSignup(onSignupSubmit)} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-indigo-300/70 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input
                  {...registerSignup('name')}
                  className="input-field"
                  placeholder="Enter your professional name"
                />
                {signupErrors.name && <p className="text-pink-400 text-[10px] font-bold mt-1 ml-1 uppercase">{signupErrors.name.message}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-indigo-300/70 uppercase tracking-[0.2em] ml-1">Company / Organization</label>
                <div className="relative">
                  <input
                    {...registerSignup('companyName')}
                    list="company-options"
                    className="input-field"
                    placeholder="Search or add company"
                    autoComplete="off"
                  />
                  <datalist id="company-options">
                    {companies.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>
                {signupErrors.companyName && <p className="text-pink-400 text-[10px] font-bold mt-1 ml-1 uppercase">{signupErrors.companyName.message}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-300/70 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                {...(isLogin ? registerLogin('email') : registerSignup('email'))}
                type="email"
                className="input-field"
                placeholder="name@company.com"
              />
              {(isLogin ? loginErrors.email : signupErrors.email) && (
                <p className="text-pink-400 text-[10px] font-bold mt-1 ml-1 uppercase">{(isLogin ? loginErrors.email : signupErrors.email)?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-300/70 uppercase tracking-[0.2em] ml-1">Secure Password</label>
              <input
                {...(isLogin ? registerLogin('password') : registerSignup('password'))}
                type="password"
                className="input-field"
                placeholder="••••••••••••"
              />
              {(isLogin ? loginErrors.password : signupErrors.password) && (
                <p className="text-pink-400 text-[10px] font-bold mt-1 ml-1 uppercase">{(isLogin ? loginErrors.password : signupErrors.password)?.message}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-indigo-300/70 uppercase tracking-[0.2em] ml-1">Organizational Role</label>
                <div className="relative">
                  <select
                    {...registerSignup('role')}
                    className="input-field appearance-none cursor-pointer pr-10"
                  >
                    <option value="worker" className="text-gray-900">Operational Specialist</option>
                    <option value="manager" className="text-gray-900">Strategic Manager</option>
                    <option value="owner" className="text-gray-900">Platform Owner</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            )}

            {serverError && (
              <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-bold py-3 px-4 rounded-xl text-center uppercase tracking-wider animate-shake">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="uppercase tracking-widest text-sm">Synchronizing...</span>
                </div>
              ) : (
                <span className="uppercase tracking-[0.15em] text-sm">{isLogin ? 'Initialize Session' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-white/30 text-[11px] font-medium tracking-wide uppercase">
            {isLogin ? "New to the platform?" : "Back to established access?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-black hover:text-indigo-400 transition-colors ml-1"
            >
              {isLogin ? 'Register Access' : 'Secure Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}