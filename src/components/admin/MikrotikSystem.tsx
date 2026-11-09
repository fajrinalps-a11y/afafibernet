import React, { useState } from 'react';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Shield,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';

export const MikrotikSystem: React.FC = () => {
  const { customers, packages, integrations, testMikrotikSync, toggleCustomerIsolir } = useISP();
  const [activeTab, setActiveTab] = useState<'sessions' | 'queues' | 'isolir'>('sessions');
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    const res = await testMikrotikSync();
    setIsSyncing(false);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 5000);
  };

  const isolatedCustomers = customers.filter(c => c.status === 'isolated');
  const activeCustomers = customers.filter(c => c.status === 'active');

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Integrasi Core Router MikroTik (RouterOS)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Host: <code className="font-mono text-cyan-700 font-bold">{integrations.mikrotik.host}:{integrations.mikrotik.port}</code> · Interface: <code className="font-mono text-slate-700">{integrations.mikrotik.interfaceName}</code> · API v6.49 / v7
          </p>
        </div>

        <button
          disabled={isSyncing}
          onClick={handleSync}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sync RouterOS State</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Router Resource Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Router Model & Versi</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block font-mono">CCR1009-7G-1C-1S+</span>
          <span className="text-[10px] text-slate-400">RouterOS v7.14.2</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Beban CPU Router</span>
          <span className="text-sm font-bold text-emerald-600 mt-1 block font-mono">14% (Normal)</span>
          <span className="text-[10px] text-slate-400">Uptime: 48d 14h 22m</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Sesi PPPoE Aktif</span>
          <span className="text-sm font-bold text-cyan-700 mt-1 block font-mono">{activeCustomers.length} Sesi Aktif</span>
          <span className="text-[10px] text-slate-400">Server: pppoe-in-afafiber</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Address-List Isolir</span>
          <span className="text-sm font-bold text-red-600 mt-1 block font-mono">{isolatedCustomers.length} Dialihkan</span>
          <span className="text-[10px] text-slate-400">Profile: {integrations.mikrotik.isolirProfile}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'sessions'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sesi PPPoE Aktif (/ppp active)
        </button>
        <button
          onClick={() => setActiveTab('queues')}
          className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'queues'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Simple Queue Rate Limits (/queue simple)
        </button>
        <button
          onClick={() => setActiveTab('isolir')}
          className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'isolir'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Firewall Isolir Pool ({isolatedCustomers.length})
        </button>
      </div>

      {/* Tab Content: PPPoE Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                  <th className="p-3.5">PPPoE User</th>
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">IP Address Assigned</th>
                  <th className="p-3.5">Service / Caller-ID</th>
                  <th className="p-3.5">Paket Fiber</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map(c => {
                  const pkg = packages.find(p => p.id === c.packageId);
                  const isIso = c.status === 'isolated';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{c.pppoeUsername}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{c.name}</span>
                        <span className="font-mono text-[11px] text-cyan-700">{c.id}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{c.ipAddress}</td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        pppoe · {c.ontSerial.slice(0, 10)}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{pkg?.speed}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          !isIso
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {!isIso ? 'CONNECTED' : 'ISOLATED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Simple Queues */}
      {activeTab === 'queues' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                  <th className="p-3.5">Nama Queue</th>
                  <th className="p-3.5">Target IP</th>
                  <th className="p-3.5">Max Limit (Upload / Download)</th>
                  <th className="p-3.5">Traffic Real-Time (Tx / Rx)</th>
                  <th className="p-3.5">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map(c => {
                  const pkg = packages.find(p => p.id === c.packageId);
                  const speed = pkg ? `${pkg.speedMbps}M/${pkg.speedMbps}M` : '10M/10M';
                  const isIso = c.status === 'isolated';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5 font-mono font-bold text-slate-900">queue-{c.id.toLowerCase()}</td>
                      <td className="p-3.5 font-mono text-slate-700">{c.ipAddress}</td>
                      <td className="p-3.5 font-mono font-bold text-cyan-700">
                        {isIso ? '128k/128k (Isolir Limiter)' : speed}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                        {isIso ? '0.0 bps / 0.0 bps' : `${Math.floor(1 + Math.random() * 4)}.${Math.floor(1 + Math.random() * 9)} Mbps / ${Math.floor(2 + Math.random() * (pkg?.speedMbps || 7))} Mbps`}
                      </td>
                      <td className="p-3.5 text-slate-600">8 (Standard Best-Effort)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Isolir Address List */}
      {activeTab === 'isolir' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Pelanggan Terisolir (Firewall Address-List)</h3>
            <p className="text-xs text-slate-500">
              Pelanggan pada daftar ini dialihkan port 80/443 secara otomatis ke halaman pemberitahuan tagihan AFAFIBER.
            </p>
          </div>

          {isolatedCustomers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
              Tidak ada pelanggan yang sedang terisolir saat ini.
            </div>
          ) : (
            <div className="space-y-3">
              {isolatedCustomers.map(cust => (
                <div key={cust.id} className="p-4 bg-red-50/50 rounded-lg border border-red-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{cust.name} ({cust.id})</span>
                    <p className="font-mono text-xs text-red-700 mt-0.5">IP: {cust.ipAddress} · Address-List: 'pelanggan-isolir'</p>
                    <p className="text-[11px] text-slate-500">Alasan: Tagihan lewat jatuh tempo</p>
                  </div>
                  <button
                    onClick={() => toggleCustomerIsolir(cust.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Buka Isolir (Manual)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
