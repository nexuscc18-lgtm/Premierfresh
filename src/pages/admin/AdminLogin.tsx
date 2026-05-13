import { useState } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password. Please try again.');
    } else {
      onLogin();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="24" cy="24" r="22" stroke="#f5a623" strokeWidth="3" fill="transparent"/>
                <circle cx="24" cy="24" r="17" stroke="#22a94b" strokeWidth="2.5" fill="none"/>
                <circle cx="24" cy="24" r="11" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="24" cy="24" r="6" fill="#f5a623"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-white">Premier</span>
              <span className="font-display font-black text-2xl text-brand-green italic">fresh</span>
            </div>
          </div>
          <h1 className="font-display font-black text-white text-2xl">Admin Portal</h1>
          <p className="text-blue-200 text-sm mt-1">Sign in to manage weekly specials and products</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-display font-bold text-neutral-800 text-xl mb-6">Sign In</h2>

          {error && (
            <div className="flex items-start gap-2.5 bg-error-light border border-error/30 text-error-dark rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-error" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@premierfresh.co.za"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-bold py-3.5 rounded-xl hover:bg-brand-blue-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">
          Premier Fresh (Pty) Ltd &mdash; Staff Access Only
        </p>
      </div>
    </div>
  );
}
