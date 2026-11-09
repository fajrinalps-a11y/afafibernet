import React, { useState } from 'react';
import { Lock, User, ShieldAlert, ArrowRight, Radio, CheckCircle, Server } from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { UserRole } from '../../types/isp';

interface AdminLoginProps {
  onSwitchToCustomer: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSwitchToCustomer }) => {
  const { loginAdmin, users, companySettings } = useISP();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Username wajib diisi.');
      return;
    }
    const success = loginAdmin(username, password);
    if (!success) {
      setErrorMessage('Username atau kata sandi tidak cocok.');
    }
  };

  const handleQuickDemoLogin = (targetUsername: string, role: UserRole) => {
    const targetUser = users.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
    const pass = targetUser?.password || (targetUsername === 'admin' ? 'admin123' : targetUsername === 'billing' ? 'billing123' : 'teknisi123');
    setUsername(targetUsername);
    setPassword(pass);
    setSelectedRole(role);
    loginAdmin(targetUsername, pass);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Network Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {companySettings.logoUrl ? (
            <img src={companySettings.logoUrl} alt={companySettings.name} className="h-9 max-w-[130px] object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              AF
            </div>
          )}
          <div>
            <span className="font-bold text-base tracking-tight text-white block">{companySettings.name}</span>
            <span className="text-[11px] text-cyan-400 font-medium">ISP Control & Billing Console</span>
          </div>
        </div>

        <button
          onClick={onSwitchToCustomer}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-800/80 hover:border-cyan-600 transition-colors"
        >
          ← Portal Pelanggan
        </button>
      </header>

      {/* Admin Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
              <Server className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Login Administrator ISP</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manajemen Mikrotik, GenieACS, Billing Pelanggan, ODC & ODP Peta Fiber
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Username Petugas</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  placeholder="admin"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Hak Akses (Role):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'super_admin', label: 'Super Admin' },
                  { id: 'admin_billing', label: 'Billing' },
                  { id: 'teknisi', label: 'Teknisi' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id as UserRole)}
                    className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                      selectedRole === r.id
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 mt-2"
            >
              <span>Masuk ke Dashboard ISP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access for testing roles */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Akses Cepat Demo Akun:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'super_admin')}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-center text-[10px] font-medium text-slate-300 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('billing', 'admin_billing')}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-center text-[10px] font-medium text-slate-300 transition-colors"
              >
                Admin Billing
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teknisi', 'teknisi')}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-center text-[10px] font-medium text-slate-300 transition-colors"
              >
                Teknisi FO
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-600">
        <p>© 2026 {companySettings.name} Billing & Network Management Core Engine</p>
      </footer>
    </div>
  );
};
