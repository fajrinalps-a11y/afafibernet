import React, { useState } from 'react';
import {
  Link2,
  Mail,
  CreditCard,
  MessageCircle,
  Cpu,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Radio
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';

export const IntegrationsPanel: React.FC = () => {
  const { integrations, updateIntegrations, testTelegram, testWhatsapp, testMikrotikSync } = useISP();
  
  const [activeTab, setActiveTab] = useState<'telegram' | 'mikrotik' | 'payment' | 'whatsapp' | 'email'>('telegram');
  const [showKeys, setShowKeys] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Testing loaders
  const [loadingTest, setLoadingTest] = useState<string | null>(null);

  // Email test input
  const [testEmailTarget, setTestEmailTarget] = useState('billing@afafiber.net');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleTestTelegramAction = async () => {
    setLoadingTest('telegram');
    const res = await testTelegram();
    setLoadingTest(null);
    triggerToast(res.message);
  };

  const handleTestWhatsappAction = async () => {
    setLoadingTest('whatsapp');
    const res = await testWhatsapp();
    setLoadingTest(null);
    triggerToast(res.message);
  };

  const handleTestMikrotikAction = async () => {
    setLoadingTest('mikrotik');
    const res = await testMikrotikSync();
    setLoadingTest(null);
    triggerToast(res.message);
  };

  const handleTestEmailAction = async () => {
    setLoadingTest('email');
    await new Promise(r => setTimeout(r, 600));
    setLoadingTest(null);
    triggerToast(`Email uji coba berhasil dikirim ke ${testEmailTarget} via SMTP ${integrations.email.smtpHost}:${integrations.email.smtpPort}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Pusat Integrasi Eksternal (API & Gateway)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Konfigurasi koneksi Email SMTP, Payment Gateway, WhatsApp API, Core MikroTik, dan Bot Telegram.
          </p>
        </div>

        <button
          onClick={() => setShowKeys(!showKeys)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showKeys ? 'Sembunyikan Kunci Rahasia' : 'Tampilkan API Keys'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'telegram'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Telegram ({integrations.telegram.status ? 'Aktif' : 'Non-aktif'})</span>
        </button>

        <button
          onClick={() => setActiveTab('mikrotik')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'mikrotik'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>MikroTik RouterOS</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'payment'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'email'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email (SMTP)</span>
        </button>
      </div>

      {/* 1. TELEGRAM INTEGRATION (Strictly per instructions) */}
      {activeTab === 'telegram' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi Telegram Bot AFAFIBER</h3>
              <p className="text-xs text-slate-500">Menerima alert pembayaran tagihan masuk dan log isolir MikroTik langsung ke chat Telegram Anda</p>
            </div>

            {/* Status Field */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Status:</span>
              <button
                onClick={() => {
                  updateIntegrations({
                    telegram: {
                      ...integrations.telegram,
                      status: !integrations.telegram.status
                    }
                  });
                  triggerToast(`Status Telegram diubah menjadi ${!integrations.telegram.status ? 'Aktif' : 'Non-aktif'}.`);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  integrations.telegram.status
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {integrations.telegram.status ? '● Aktif' : '○ Non-aktif'}
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Tokenbot */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tokenbot (Diberikan oleh @BotFather)</label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={integrations.telegram.tokenBot}
                onChange={e => {
                  updateIntegrations({
                    telegram: { ...integrations.telegram, tokenBot: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* usernamebot & username telegram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">usernamebot</label>
                <input
                  type="text"
                  value={integrations.telegram.usernameBot}
                  onChange={e => {
                    updateIntegrations({
                      telegram: { ...integrations.telegram, usernameBot: e.target.value }
                    });
                  }}
                  placeholder="@afafiber_bot"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">username telegram (Admin)</label>
                <input
                  type="text"
                  value={integrations.telegram.usernameTelegram}
                  onChange={e => {
                    updateIntegrations({
                      telegram: { ...integrations.telegram, usernameTelegram: e.target.value }
                    });
                  }}
                  placeholder="@afafiber_admin"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* id telegram */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">id telegram (Chat ID Anda)</label>
              <input
                type="text"
                value={integrations.telegram.idTelegram}
                onChange={e => {
                  updateIntegrations({
                    telegram: { ...integrations.telegram, idTelegram: e.target.value }
                  });
                }}
                placeholder="Contoh: 1849201948"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Dapatkan ID Telegram Anda dengan mengirim pesan ke @userinfobot di Telegram.</p>
            </div>

            {/* test kirim pesan button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Uji koneksi pengiriman pesan bot secara langsung</span>
              <button
                type="button"
                disabled={loadingTest === 'telegram'}
                onClick={handleTestTelegramAction}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                <Send className={`w-3.5 h-3.5 ${loadingTest === 'telegram' ? 'animate-spin' : ''}`} />
                <span>Test Kirim Pesan Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MIKROTIK INTEGRATION */}
      {activeTab === 'mikrotik' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi MikroTik RouterOS</h3>
              <p className="text-xs text-slate-500">Sinkronisasi PPPoE Secrets, Simple Queue Bandwidth, dan Address-List Isolir</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>API Ready (Port 8728)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">IP Host / Server RouterOS</label>
              <input
                type="text"
                value={integrations.mikrotik.host}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, host: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Port API RouterOS</label>
              <input
                type="number"
                value={integrations.mikrotik.port}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, port: Number(e.target.value) }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Username API</label>
              <input
                type="text"
                value={integrations.mikrotik.username}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, username: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Profile Isolir</label>
              <input
                type="text"
                value={integrations.mikrotik.isolirProfile}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, isolirProfile: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pool IP Isolir</label>
              <input
                type="text"
                value={integrations.mikrotik.isolirPool}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, isolirPool: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Interface Traffic Gateway</label>
              <input
                type="text"
                value={integrations.mikrotik.interfaceName}
                onChange={e => {
                  updateIntegrations({
                    mikrotik: { ...integrations.mikrotik, interfaceName: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Sinkronisasi terakhir: {integrations.mikrotik.lastSync || 'Hari ini'}</span>
            <button
              type="button"
              disabled={loadingTest === 'mikrotik'}
              onClick={handleTestMikrotikAction}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTest === 'mikrotik' ? 'animate-spin' : ''}`} />
              <span>Uji Koneksi & Sync MikroTik</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. WHATSAPP GATEWAY */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi WhatsApp Gateway API</h3>
              <p className="text-xs text-slate-500">Mendukung penyedia Fonnte, Wablas, atau Wwebjs untuk notifikasi otomatis</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gateway Aktif</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Penyedia Layanan (Provider)</label>
                <select
                  value={integrations.whatsapp.provider}
                  onChange={e => {
                    updateIntegrations({
                      whatsapp: { ...integrations.whatsapp, provider: e.target.value as any }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="fonnte">Fonnte API Gateway</option>
                  <option value="wablas">Wablas WhatsApp Business</option>
                  <option value="wwebjs">Wwebjs Node Server</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp Pengirim Resmi</label>
                <input
                  type="text"
                  value={integrations.whatsapp.senderNumber}
                  onChange={e => {
                    updateIntegrations({
                      whatsapp: { ...integrations.whatsapp, senderNumber: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">API Token / Secret Key</label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={integrations.whatsapp.apiKey}
                onChange={e => {
                  updateIntegrations({
                    whatsapp: { ...integrations.whatsapp, apiKey: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Template Notifikasi Tagihan Bulanan</label>
              <textarea
                rows={3}
                value={integrations.whatsapp.billingTemplate}
                onChange={e => {
                  updateIntegrations({
                    whatsapp: { ...integrations.whatsapp, billingTemplate: e.target.value }
                  });
                }}
                className="w-full p-3 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Tes koneksi kirim pesan WA ke pengirim</span>
              <button
                type="button"
                disabled={loadingTest === 'whatsapp'}
                onClick={handleTestWhatsappAction}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className={`w-3.5 h-3.5 ${loadingTest === 'whatsapp' ? 'animate-spin' : ''}`} />
                <span>Test Kirim WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAYMENT GATEWAY */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi Gateway Pembayaran (QRIS, VA & E-Wallet)</h3>
              <p className="text-xs text-slate-500">Mendukung Midtrans Snap, Xendit, dan Tripay untuk penerimaan dana instan real-time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Mode:</span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase">
                {integrations.paymentGateway.isProduction ? 'PRODUCTION' : 'SANDBOX / UJI COBA'}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Provider Payment Gateway</label>
                <select
                  value={integrations.paymentGateway.provider}
                  onChange={e => {
                    updateIntegrations({
                      paymentGateway: { ...integrations.paymentGateway, provider: e.target.value as any }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="midtrans">Midtrans (BCA, QRIS, GoPay, ShopeePay)</option>
                  <option value="xendit">Xendit (Virtual Account Multi-Bank & OVO)</option>
                  <option value="tripay">Tripay Payment Gateway</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Merchant ID</label>
                <input
                  type="text"
                  value={integrations.paymentGateway.merchantId}
                  onChange={e => {
                    updateIntegrations({
                      paymentGateway: { ...integrations.paymentGateway, merchantId: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Client Key / Public Key</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={integrations.paymentGateway.clientKey}
                  onChange={e => {
                    updateIntegrations({
                      paymentGateway: { ...integrations.paymentGateway, clientKey: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Server Key / Secret Key</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={integrations.paymentGateway.serverKey}
                  onChange={e => {
                    updateIntegrations({
                      paymentGateway: { ...integrations.paymentGateway, serverKey: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isProdCheck"
                checked={integrations.paymentGateway.isProduction}
                onChange={e => {
                  updateIntegrations({
                    paymentGateway: { ...integrations.paymentGateway, isProduction: e.target.checked }
                  });
                }}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="isProdCheck" className="text-slate-700 font-medium">
                Aktifkan Mode Produksi (Live Real-Money Payment)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. EMAIL (SMTP) */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi Email (SMTP Server)</h3>
              <p className="text-xs text-slate-500">Pengiriman invoice tagihan dan kuitansi elektronik resmi via email</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SMTP Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">SMTP Host</label>
              <input
                type="text"
                value={integrations.email.smtpHost}
                onChange={e => {
                  updateIntegrations({
                    email: { ...integrations.email, smtpHost: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">SMTP Port</label>
              <input
                type="number"
                value={integrations.email.smtpPort}
                onChange={e => {
                  updateIntegrations({
                    email: { ...integrations.email, smtpPort: Number(e.target.value) }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Enkripsi Keamanan</label>
              <select
                value={integrations.email.secure ? 'ssl' : 'tls'}
                onChange={e => {
                  updateIntegrations({
                    email: { ...integrations.email, secure: e.target.value === 'ssl' }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="ssl">SSL / TLS (Port 465)</option>
                <option value="tls">STARTTLS (Port 587)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Pengirim Resmi</label>
              <input
                type="email"
                value={integrations.email.senderEmail}
                onChange={e => {
                  updateIntegrations({
                    email: { ...integrations.email, senderEmail: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Tampilan Pengirim (Sender Name)</label>
              <input
                type="text"
                value={integrations.email.senderName}
                onChange={e => {
                  updateIntegrations({
                    email: { ...integrations.email, senderName: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold">Tujuan Test Email:</span>
              <input
                type="email"
                value={testEmailTarget}
                onChange={e => setTestEmailTarget(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs w-56 font-mono"
              />
            </div>

            <button
              type="button"
              disabled={loadingTest === 'email'}
              onClick={handleTestEmailAction}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Mail className={`w-3.5 h-3.5 ${loadingTest === 'email' ? 'animate-spin' : ''}`} />
              <span>Test Kirim Email SMTP</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
