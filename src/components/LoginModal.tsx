import React, { useState } from 'react';
import { Mail, Lock, User, X, AlertCircle, Sparkles, GraduationCap } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required for secure password sign-in.');
      return;
    }
    setError('');
    setLoading(true);

    const url = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const body = isSignUp ? { name, email, password } : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during authentication.');
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOnlySubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your Email ID first.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/email-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: isSignUp ? name : undefined })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during email-only authentication.');
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Preset filler for evaluation
  const fillPresetCredentials = () => {
    setEmail('ishwarhiremath2823@gmail.com');
    setPassword('password123');
    setIsSignUp(false);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-slate-950 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-950 text-emerald-400 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-950">
                {isSignUp ? 'Join Educuria Hub' : 'Welcome back to Educuria'}
              </h3>
              <p className="text-xs font-medium text-slate-900 mt-0.5">
                {isSignUp ? 'Register with Email ID to unlock features' : 'Enter your Email ID & password to proceed'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-black/10 text-slate-950 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 flex-grow">
          {/* Preset Helper Alert */}
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="text-emerald-300 font-semibold mb-1">Lead Educator Profile Available</p>
              <p className="text-slate-300 leading-normal mb-2">
                Click below to instantly pre-fill Ishwar Hiremath’s verified administrator email ID and test password.
              </p>
              <button
                type="button"
                onClick={fillPresetCredentials}
                className="inline-flex items-center space-x-1 font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-1 px-2.5 rounded-md text-[10px] transition cursor-pointer"
              >
                <span>Pre-fill ishwarhiremath2823</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Email ID replacing Mobile Number */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* PASSWORDLESS PRIMARY CALL */}
            <button
              type="button"
              disabled={loading}
              onClick={handleEmailOnlySubmit}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Mail className="h-4 w-4 text-slate-950" />
              <span>{loading ? 'Processing...' : isSignUp ? 'Continue with Email (Password-free)' : 'Continue with Email (Password-free)'}</span>
            </button>

            {/* DIVIDER */}
            <div className="flex items-center my-4 pt-1">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="mx-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">or use secure password</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Password (Optional if password-free)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/30 text-slate-300 hover:text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>{isSignUp ? 'Register with Password' : 'Secure Password Login'}</span>
            </button>
          </form>

          {/* Tab Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs">
            <p className="text-slate-400">
              {isSignUp ? 'Already have an account?' : 'New student seeking tracker access?'}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-emerald-400 font-bold ml-1 hover:underline cursor-pointer focus:outline-none"
              >
                {isSignUp ? 'Sign In' : 'Create Profile'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
