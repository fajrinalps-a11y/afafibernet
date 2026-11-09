import React, { useState } from 'react';
import {
  Wifi,
  Lock,
  Calendar,
  CreditCard,
  Printer,
  KeyRound,
  Shield,
  MessageCircle,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { ReceiptModal } from '../common/ReceiptModal';
import { PaymentGatewayModal } from '../common/PaymentGatewayModal';
import { Invoice } from '../../types/isp';

export const CustomerPortal: React.FC = () => {
  const {
    currentCustomer,
    logoutCustomer,
    invoices,
    packages,
    companySettings,
    bankAccounts,
    updateWifiSettings,
    changePackage,
    payInvoice
  } = useISP();

  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'wifi' | 'packages'>('overview');
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  
  // Wi-Fi Form
  const [newSSID, setNewSSID] = useState(currentCustomer?.wifiSSID || '');
  const [newPassword, setNewPassword] = useState(currentCustomer?.wifiPassword || '');
  const [wifiSaveSuccess, setWifiSaveSuccess] = useState(false);

  // Selected for Receipt & Payment Modals
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  // Package Change Modal/State
  const [selectedNewPkgId, setSelectedNewPkgId] = useState<string>('');
  const [pkgChangeSuccess, setPkgChangeSuccess] = useState(false);

  if (!currentCustomer) {
    return null;
  }

  const customerInvoices = invoices.filter(inv => inv.customerId === currentCustomer.id);
  const unpaidInvoice = customerInvoices.find(inv => inv.status !== 'paid');
  const currentPkg = packages.find(p => p.id === currentCustomer.packageId) || packages[0];

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('Password Wi-Fi minimal 8 karakter.');
      return;
    }
    updateWifiSettings(currentCustomer.id, newSSID, newPassword);
    setWifiSaveSuccess(true);
    setTimeout(() => setWifiSaveSuccess(false), 4000);
  };

  const handleConfirmPackageChange = (packageId: string) => {
    if (packageId === currentCustomer.packageId) return;
    changePackage(currentCustomer.id, packageId);
    setPkgChangeSuccess(true);
    setTimeout(() => setPkgChangeSuccess(false), 4000);
  };

  const handlePaymentSuccess = (method: string) => {
    if (paymentInvoice) {
      payInvoice(paymentInvoice.id, method);
      const updatedInv = {
        ...paymentInvoice,
        status: 'paid' as const,
        paymentMethod: method,
        paidAt: new Date().toLocaleString('id-ID')
      };
      setPaymentInvoice(null);
      setReceiptInvoice(updatedInv);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Bar for Customer Portal */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {companySettings.logoUrl ? (
              <img src={companySettings.logoUrl} alt={companySettings.name} className="h-8 max-w-[120px] object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                AF
              </div>
            )}
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight block leading-none">{companySettings.name}</span>
              <span className="text-[11px] text-slate-500 font-medium">Portal Pelanggan Mandiri</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors whitespace-nowrap py-1 ${activeTab === 'overview' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ringkasan Layanan
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`transition-colors whitespace-nowrap py-1 ${activeTab === 'bills' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Tagihan & Riwayat
            </button>
            <button
              onClick={() => setActiveTab('wifi')}
              className={`transition-colors whitespace-nowrap py-1 ${activeTab === 'wifi' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ganti Password Wi-Fi
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`transition-colors whitespace-nowrap py-1 ${activeTab === 'packages' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ubah Paket Internet
            </button>
          </nav>

          {/* Customer Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{currentCustomer.name}</p>
              <p className="text-[11px] font-mono text-cyan-700">{currentCustomer.id}</p>
            </div>
            <button
              onClick={logoutCustomer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
              title="Keluar dari Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Unpaid Bill Banner Alert */}
        {unpaidInvoice && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">Tagihan Internet Periode {unpaidInvoice.period} Belum Dibayar</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Nominal: <span className="font-mono font-bold">Rp {unpaidInvoice.amount.toLocaleString('id-ID')}</span> · Jatuh Tempo: <span className="font-semibold">{unpaidInvoice.dueDate}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setPaymentInvoice(unpaidInvoice)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <span>Bayar Sekarang (Real-time)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Customer Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Account Identification */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Informasi Akun Pelanggan</span>
                <h2 className="text-lg font-bold text-slate-900">{currentCustomer.name}</h2>
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID Pelanggan:</span>
                    <span className="font-mono font-bold text-cyan-700">{currentCustomer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIK KTP:</span>
                    <span className="font-mono font-medium text-slate-800">{currentCustomer.nikKtp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">WhatsApp:</span>
                    <span className="font-medium text-slate-800">{currentCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alamat:</span>
                    <span className="font-medium text-slate-800 text-right max-w-[180px] truncate" title={currentCustomer.address}>
                      {currentCustomer.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service & Connection Status */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Status Layanan Internet</span>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${
                    currentCustomer.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {currentCustomer.status === 'active' ? '● LAYANAN AKTIF' : '● MENUNGGU PEMBAYARAN'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Paket Langganan:</span>
                    <span className="font-bold text-slate-900">{currentPkg.speed} ({currentPkg.name})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jatuh Tempo Bulanan:</span>
                    <span className="font-semibold text-slate-800">Tanggal {currentCustomer.dueDay} Setiap Bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mulai Berlangganan:</span>
                    <span className="font-medium text-slate-800">{currentCustomer.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Wi-Fi Card Quick Look */}
              <div className="bg-gradient-to-br from-slate-900 to-cyan-950 text-white p-6 rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">Wi-Fi Rumah Anda</span>
                    <Wifi className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-300">Nama Wi-Fi (SSID):</p>
                  <p className="text-base font-bold font-mono tracking-wide text-white truncate">{currentCustomer.wifiSSID}</p>
                  
                  <div className="mt-3 flex items-center justify-between bg-white/10 p-2.5 rounded-lg border border-white/10">
                    <div>
                      <p className="text-[10px] text-slate-300">Password Wi-Fi:</p>
                      <p className="font-mono text-xs font-semibold">
                        {showWifiPassword ? currentCustomer.wifiPassword : '••••••••••••'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="text-slate-300 hover:text-white p-1 rounded"
                    >
                      {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('wifi')}
                  className="mt-4 text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors self-start"
                >
                  <span>Ganti Password & SSID</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Quick Actions & Recent Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Invoices List */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Riwayat Tagihan & Pembayaran</h3>
                    <p className="text-xs text-slate-500">Pantau status tagihan dan unduh kuitansi resmi Anda</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bills')}
                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-3">No. Tagihan</th>
                        <th className="pb-3">Periode</th>
                        <th className="pb-3 text-right">Nominal</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerInvoices.slice(0, 4).map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/70">
                          <td className="py-3 font-mono font-medium text-slate-800">{inv.id}</td>
                          <td className="py-3 text-slate-700">{inv.period}</td>
                          <td className="py-3 text-right font-mono font-bold text-slate-900">
                            Rp {inv.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'overdue'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {inv.status === 'paid' ? 'Lunas' : inv.status === 'overdue' ? 'Jatuh Tempo' : 'Belum Bayar'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {inv.status === 'paid' ? (
                              <button
                                onClick={() => setReceiptInvoice(inv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded border border-cyan-200 transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Cetak Struk</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setPaymentInvoice(inv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
                              >
                                <span>Bayar</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Col: Customer Support & Self Care Help */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Bantuan & Layanan Mandiri</h3>
                  <p className="text-xs text-slate-500 mb-4">Butuh bantuan teknis atau ada kendala koneksi?</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-700 block">Layanan Pelanggan WhatsApp 24 Jam:</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{companySettings.csWhatsapp}</p>
                      <a
                        href={`https://wa.me/${companySettings.csWhatsapp.replace(/[^0-9]/g, '')}?text=Halo%20AFAFIBER,%20saya%20pelanggan%20${currentCustomer.name}%20(ID:%20${currentCustomer.id})%20membutuhkan%20bantuan.`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat CS WhatsApp
                      </a>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 block mb-1">Tips Koneksi Lancar:</span>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                        <li>Letakkan router di tempat terbuka bebas halangan.</li>
                        <li>Ganti password Wi-Fi secara berkala jika dirasa lambat.</li>
                        <li>Restart router sesekali dengan mematikan tombol power 10 detik.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  Jam Operasional Kantor: {companySettings.operatingHours}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Bills & Payments */}
        {activeTab === 'bills' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Riwayat Tagihan & Pembayaran Mandiri</h2>
                <p className="text-xs text-slate-500">Cetak struk resmi kapan saja untuk bukti pembayaran yang sah</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Total Transaksi: <strong className="text-slate-800">{customerInvoices.length}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="p-3">No. Tagihan</th>
                    <th className="p-3">Periode</th>
                    <th className="p-3">Paket Internet</th>
                    <th className="p-3 text-right">Nominal</th>
                    <th className="p-3">Tanggal Terbit</th>
                    <th className="p-3">Jatuh Tempo</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-slate-800">{inv.id}</td>
                      <td className="p-3 text-slate-700 font-medium">{inv.period}</td>
                      <td className="p-3 text-slate-600">{inv.packageName}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-slate-500">{inv.createdAt}</td>
                      <td className="p-3 text-slate-500">{inv.dueDate}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'overdue'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.status === 'paid' ? 'LUNAS' : inv.status === 'overdue' ? 'JATUH TEMPO' : 'BELUM BAYAR'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {inv.status === 'paid' ? (
                          <button
                            onClick={() => setReceiptInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-cyan-700 bg-white hover:bg-cyan-50 rounded-md border border-slate-200 hover:border-cyan-200 transition-colors shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Struk</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setPaymentInvoice(inv)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors shadow-xs"
                          >
                            <span>Bayar Sekarang</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Wi-Fi Name & Password Changer */}
        {activeTab === 'wifi' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Ganti Nama (SSID) & Password Wi-Fi</h2>
                <p className="text-xs text-slate-500">Konfigurasi langsung dikirim ke router modem rumah Anda secara instan</p>
              </div>
            </div>

            {wifiSaveSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Berhasil! Nama dan Password Wi-Fi telah berhasil diperbarui dan diterapkan ke router Anda.</span>
              </div>
            )}

            <form onSubmit={handleSaveWifi} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nama Wi-Fi Baru (SSID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newSSID}
                    onChange={e => setNewSSID(e.target.value)}
                    placeholder="Contoh: AFAFIBER_RUMAH_5G"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                  <Wifi className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Nama ini akan terlihat oleh semua perangkat yang mencari sinyal Wi-Fi.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Password Wi-Fi Baru (WPA2-PSK)
                </label>
                <div className="relative">
                  <input
                    type={showWifiPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Gunakan kombinasi huruf dan angka minimal 8 karakter agar aman dari pembobolan.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Perangkat modem: <strong className="text-slate-700">{currentCustomer.ontModel}</strong></span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  Simpan & Terapkan ke Router
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Self-Service Package Change */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-lg font-bold text-slate-900">Ubah Paket Internet Secara Mandiri</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih paket fiber optic yang sesuai dengan kebutuhan internet keluarga atau usaha Anda. Perubahan kecepatan aktif seketika!
              </p>
            </div>

            {pkgChangeSuccess && (
              <div className="max-w-2xl mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paket internet berhasil diubah! Kecepatan baru Anda telah disesuaikan secara otomatis.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map(pkg => {
                const isCurrent = pkg.id === currentCustomer.packageId;
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-xl border p-6 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-cyan-600 ring-2 ring-cyan-500/30 bg-cyan-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-cyan-600 text-white text-[10px] font-bold uppercase rounded-full shadow-xs">
                        Paket Anda Saat Ini
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{pkg.name}</span>
                        <Zap className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-extrabold text-slate-900">{pkg.speed}</span>
                        <span className="text-xs text-slate-500 block">Dedicated Fiber</span>
                      </div>
                      <div className="mb-5 pb-5 border-b border-slate-100">
                        <span className="font-mono text-xl font-bold text-cyan-700">Rp {pkg.price.toLocaleString('id-ID')}</span>
                        <span className="text-xs text-slate-400"> / bulan</span>
                      </div>

                      <p className="text-xs text-slate-600 mb-4">{pkg.description}</p>

                      <ul className="space-y-2 text-xs text-slate-600">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold cursor-default"
                        >
                          Sedang Digunakan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConfirmPackageChange(pkg.id)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                        >
                          Pilih Paket Ini
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 {companySettings.name}. Semua Hak Dilindungi. {companySettings.tagline}</p>
        </div>
      </footer>

      {/* Receipt Modal (Paid Bill Struk) */}
      {receiptInvoice && (
        <ReceiptModal
          invoice={receiptInvoice}
          customer={currentCustomer}
          company={companySettings}
          bankAccounts={bankAccounts}
          onClose={() => setReceiptInvoice(null)}
        />
      )}

      {/* Payment Gateway Checkout Modal */}
      {paymentInvoice && (
        <PaymentGatewayModal
          invoice={paymentInvoice}
          bankAccounts={bankAccounts}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentInvoice(null)}
        />
      )}

    </div>
  );
};
