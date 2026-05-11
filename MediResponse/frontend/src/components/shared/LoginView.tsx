import React, { useState } from 'react';
import { Activity, ArrowRight, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginUser } from '../../services/authService';
import { User as UserType } from '../../types';

interface LoginViewProps {
  onLogin: (user: UserType, token: string) => void;
}

type RoleHint = { id: string; role: string; dept: string; color: string };

const roleHints: RoleHint[] = [
  { id: 'AMB-001', role: 'Paramedic', dept: 'Ambulance Unit', color: 'blue' },
  { id: 'HOSP-001', role: 'Hospital Admin', dept: 'Emergency Medicine', color: 'emerald' },
  { id: 'TOLL-001', role: 'Toll Operator', dept: 'Highway Control', color: 'amber' },
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!employeeId.trim() || !password.trim()) {
      setError('Please enter your Employee ID and password.');
      return;
    }

    setLoading(true);
    const result = await loginUser(employeeId.trim(), password);
    setLoading(false);

    if (result.success && result.user && result.token) {
      onLogin(result.user, result.token);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const fillDemo = (id: string) => {
    setEmployeeId(id);
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Activity size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MediResponse</h1>
          <p className="text-blue-300 text-sm font-medium mt-1 uppercase tracking-widest">Emergency Response System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8">
            <h2 className="text-white font-bold text-lg mb-1">Secure Login</h2>
            <p className="text-blue-200 text-sm mb-6">Authorized personnel only.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Employee ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="e.g. AMB-001"
                    autoComplete="username"
                  />
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>Login to System <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials panel */}
          <div className="border-t border-white/10 px-8 py-5 bg-white/5">
            <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">Demo Access — Click to fill</p>
            <div className="space-y-2">
              {roleHints.map(h => (
                <button
                  key={h.id}
                  onClick={() => fillDemo(h.id)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition group"
                >
                  <div>
                    <span className="text-white text-xs font-bold">{h.id}</span>
                    <span className="text-blue-300 text-xs ml-2">— {h.role}</span>
                  </div>
                  <span className="text-white/30 text-[10px] font-mono group-hover:text-white/60 transition">demo123</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blue-400/50 text-xs mt-6">
          MediResponse v2.5.0 · Govt. Emergency Network
        </p>
      </div>
    </div>
  );
};

export default LoginView;
