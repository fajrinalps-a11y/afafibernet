import React, { useState } from 'react';
import { Wifi, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Phone, CreditCard } from 'lucide-react';
import { useISP } from '../../context/ISPContext';

interface CustomerLoginProps {
  onSwitchToAdmin: () => void;
}

export const CustomerLogin: React.FC<CustomerLoginProps> = ({ onSwitchToAdmin }) => {
  const { loginCustomer, customers, companySettings } = useISP();
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan ID Pelanggan, No. WhatsApp, atau NIK KTP Anda.');
      return;
    }

    const success = loginCustomer(identifier);
    if (!success) {
      setErrorMessage('Data pelanggan tidak ditemukan. Periksa kembali ID Pelanggan atau No. WhatsApp Anda.');
    }
  };

  const handleQuickLogin = (id: string) => {
    loginCustomer(id);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
      
      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {companySettings.logoUrl ? (
            <img src={companySettings.logoUrl} alt={companySettings.name} className="h-9 max-w-[130px] object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold text-base shadow-sm">
              AF
            </div>
          )}
          <div>
            <span className="font-bold text-base tracking-tight text-white block">{companySettings.name}</span>
            <span className="text-[11px] text-cyan-400 font-medium">Customer Self-Service Portal</span>
          </div>
        </div>

        <button
          onClick={onSwitchToAdmin}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
        >
          Portal Admin / Teknisi →
        </button>
      </header>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-8 shadow-2xl">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Portal Pelanggan AFAFIBER</h1>
            <p className="text-xs text-slate-400 mt-1">
              Cek tagihan bulanan, bayar online, cetak kuitansi & ubah password Wi-Fi mandiri
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                ID Pelanggan, No. WhatsApp, atau NIK KTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => {
                    setIdentifier(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Contoh: AF-001 atau 081288992211"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Masukkan identitas yang terdaftar saat pemasangan awal internet.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Masuk ke Portal Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5 text-center">
              Akses Cepat Demo Pelanggan:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {customers.slice(0, 3).map(c => (
                <button
                  key={c.id}
                  onClick={() => handleQuickLogin(c.id)}
                  className="w-full p-2.5 bg-slate-900/60 hover:bg-slate-900 rounded-lg border border-slate-700/70 hover:border-cyan-500/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">{c.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">ID: {c.id} · NIK: {c.nikKtp}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.status === 'active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
                  }`}>
                    {c.status === 'active' ? 'Aktif' : 'Terisolir'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sistem Pembayaran Aman Terverifikasi</span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>© 2026 {companySettings.name}. Layanan Pelanggan WhatsApp: {companySettings.csWhatsapp}</p>
      </footer>
    </div>
  );
};
