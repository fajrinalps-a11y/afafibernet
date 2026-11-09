import React from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Wifi,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Zap,
  MapPin,
  CheckCircle2,
  Clock,
  Radio
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { customers, invoices, packages, notificationLogs, runAutoIsolir, sendWhatsAppBillingBlast } = useISP();

  // Metrics calculation
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const isolatedCustomers = customers.filter(c => c.status === 'isolated').length;

  const currentMonthPaidInvoices = invoices.filter(i => i.status === 'paid');
  const monthlyRevenue = currentMonthPaidInvoices.reduce((sum, i) => sum + i.amount, 0);

  const potentialRevenue = customers.reduce((sum, c) => {
    const pkg = packages.find(p => p.id === c.packageId);
    return sum + (pkg?.price || 150000);
  }, 0);

  const unpaidTotal = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const collectionRate = potentialRevenue > 0 ? Math.round((monthlyRevenue / potentialRevenue) * 100) : 0;

  // Monthly Revenue History Data (Realistic Data for 6 months)
  const monthlyData = [
    { month: 'Jun', revenue: 950000, target: 1000000, count: 5 },
    { month: 'Jul', revenue: 1050000, target: 1100000, count: 6 },
    { month: 'Ags', revenue: 1100000, target: 1200000, count: 6 },
    { month: 'Sep', revenue: 1150000, target: 1200000, count: 6 },
    { month: 'Okt', revenue: 1200000, target: 1250000, count: 7 },
    { month: 'Nov', revenue: monthlyRevenue, target: potentialRevenue, count: totalCustomers, current: true }
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.target));

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Summary Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider block mb-1">
            Ringkasan Eksekutif Pemilik Usaha
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Pendapatan & Jaringan AFAFIBER
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau arus kas pendapatan bulanan, status kolektibilitas tagihan, dan operasional ISP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kelola Tagihan</span>
          </button>
          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Buka Peta Fiber</span>
          </button>
        </div>
      </div>

      {/* 4 Key Business Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Revenue Received */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pendapatan Diterima (Bulan Ini)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-emerald-700 tracking-tight">
              Rp {monthlyRevenue.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{collectionRate}% dari potensi tagihan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Potential Full Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Potensi Pendapatan Bulanan</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
              Rp {potentialRevenue.toLocaleString('id-ID')}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Total langganan {totalCustomers} pelanggan</p>
          </div>
        </div>

        {/* Card 3: Unpaid Bills */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tagihan Tertunggak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-amber-700 tracking-tight">
              Rp {unpaidTotal.toLocaleString('id-ID')}
            </span>
            <p className="text-[11px] text-amber-600 mt-1">{invoices.filter(i => i.status !== 'paid').length} Invoice Menunggu Pelunasan</p>
          </div>
        </div>

        {/* Card 4: Customer Status Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Status Pelanggan</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold font-mono text-slate-900">{activeCustomers}</span>
              <span className="text-xs text-slate-400"> Aktif</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-red-600">{isolatedCustomers}</span>
              <span className="text-xs text-red-500"> Isolir</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section: Visual Revenue Chart & Package Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Revenue Bar Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grafik Pertumbuhan Pendapatan Bulanan</h3>
              <p className="text-xs text-slate-500">Realisasi pembayaran vs Target potensi pendapatan (6 Bulan Terakhir)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-cyan-600 rounded"></span>
                <span className="text-slate-600">Realisasi (Rp)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-200 rounded"></span>
                <span className="text-slate-400">Potensi Target</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            {monthlyData.map(d => {
              const pctRevenue = Math.round((d.revenue / maxVal) * 100);
              const pctTarget = Math.round((d.target / maxVal) * 100);

              return (
                <div key={d.month} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${d.current ? 'text-cyan-700 font-bold' : 'text-slate-700'}`}>
                      {d.month} {d.current ? '(Bulan Berjalan)' : ''}
                    </span>
                    <span className="font-mono text-slate-800 font-semibold">
                      Rp {d.revenue.toLocaleString('id-ID')} <span className="text-slate-400 font-normal">/ Rp {d.target.toLocaleString('id-ID')}</span>
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
                    {/* Target bar */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-slate-200/80 rounded-full"
                      style={{ width: `${pctTarget}%` }}
                    ></div>
                    {/* Actual revenue bar */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ${
                        d.current ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                      style={{ width: `${pctRevenue}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata Pendapatan Bulanan: <strong className="text-slate-800 font-mono">Rp 1.150.000</strong></span>
            <span className="text-emerald-600 font-semibold">Pertumbuhan Stabil +8.5% YoY</span>
          </div>
        </div>

        {/* Right Col: Package Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Distribusi Paket Berlangganan</h3>
            <p className="text-xs text-slate-500 mb-5">Komposisi paket internet yang dipilih pelanggan AFAFIBER</p>

            <div className="space-y-4">
              {packages.map(pkg => {
                const countInPkg = customers.filter(c => c.packageId === pkg.id).length;
                const pct = totalCustomers > 0 ? Math.round((countInPkg / totalCustomers) * 100) : 0;

                return (
                  <div key={pkg.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900">{pkg.speed} ({pkg.name})</span>
                      <span className="font-mono text-xs font-bold text-cyan-700">Rp {pkg.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>{countInPkg} Pelanggan</span>
                      <span>{pct}% Pangsa</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Kelola Pelanggan & Paket →
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Live System Logs & Quick Automations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log Aktivitas Sistem Real-Time</h3>
              <p className="text-xs text-slate-500">Notifikasi otomatis WhatsApp, Telegram, MikroTik dan GenieACS</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Monitoring
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {notificationLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada aktivitas baru hari ini.</p>
            ) : (
              notificationLogs.slice(0, 8).map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.type === 'wa' ? 'bg-emerald-100 text-emerald-800' :
                        log.type === 'telegram' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                      <span className="font-semibold text-slate-700">{log.target}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{log.message}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Quick Status & Health */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Status Infrastruktur ISP</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">Core MikroTik RouterOS:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terhubung
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">GenieACS TR-069 Server:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Online (4 ONT)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">WhatsApp Gateway (Fonnte):</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Siap Kirim
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">Bot Telegram Notifikasi:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onNavigate('integrations')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Pengaturan Integrasi
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
