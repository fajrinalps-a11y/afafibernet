import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Smartphone,
  Radio,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';

export const NotificationCenter: React.FC = () => {
  const {
    customers,
    odcs,
    odps,
    integrations,
    broadcasts,
    updateIntegrations,
    sendOutageNotification,
    testTelegram,
    testWhatsapp
  } = useISP();

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'telegram'>('whatsapp');
  
  // Outage broadcast form
  const [selectedArea, setSelectedArea] = useState('Semua Wilayah AFAFIBER');
  const [outageMessage, setOutageMessage] = useState(
    'Sedang dilakukan perbaikan darurat kabel fiber optik utama di area tersebut. Estimasi durasi perbaikan sekitar 2 jam. Mohon maaf atas ketidaknyamanan Anda.'
  );

  // Telegram test feedback
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramFeedback, setTelegramFeedback] = useState<string | null>(null);

  // WhatsApp test
  const [testWANumber, setTestWANumber] = useState('081298765432');
  const [isTestingWA, setIsTestingWA] = useState(false);
  const [waFeedback, setWAFeedback] = useState<string | null>(null);

  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outageMessage.trim()) return;

    sendOutageNotification(selectedArea, outageMessage);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 5000);
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    const res = await testTelegram();
    setIsTestingTelegram(false);
    setTelegramFeedback(res.message);
    setTimeout(() => setTelegramFeedback(null), 6000);
  };

  const handleTestWA = async () => {
    setIsTestingWA(true);
    const res = await testWhatsapp(testWANumber);
    setIsTestingWA(false);
    setWAFeedback(res.message);
    setTimeout(() => setWAFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Pusat Notifikasi (WhatsApp & Telegram)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Kirim broadcast info gangguan optik ke pelanggan via WhatsApp, dan pantau notifikasi pembayaran masuk via Telegram Bot.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Gateway</span>
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Telegram Bot</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WHATSAPP */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Broadcast Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kirim Notifikasi Gangguan Otomatis</h3>
                <p className="text-xs text-slate-500">Siarkan pesan pemeliharaan atau putusnya kabel optik ke pelanggan terkait</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">Fonnte WA Gateway Aktif</span>
            </div>

            {broadcastSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pesan gangguan berhasil dibroadcast ke nomor WhatsApp pelanggan di area terpilih!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Wilayah / Segmen Fiber:</label>
                <select
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="Semua Wilayah AFAFIBER">Semua Wilayah (Broadcast Seluruh Pelanggan)</option>
                  {odcs.map(o => (
                    <option key={o.id} value={`Segmen ${o.name} (${o.id})`}>
                      ODC: {o.name} ({o.locationName})
                    </option>
                  ))}
                  {odps.map(p => (
                    <option key={p.id} value={`Segmen ODP ${p.name} (${p.id})`}>
                      ODP: {p.name} - Tiang {p.locationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Isi Pesan Notifikasi WhatsApp:</label>
                <textarea
                  rows={4}
                  required
                  value={outageMessage}
                  onChange={e => setOutageMessage(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Format teks WhatsApp mendukung *tebal*, _miring_, dan emoji.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Estimasi penerima: <strong>{customers.length} Kontak</strong></span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Broadcast Gangguan</span>
                </button>
              </div>
            </form>

            {/* Riwayat Broadcast Sebelumnya */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                Riwayat Siaran Terakhir
              </span>
              {broadcasts.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada riwayat broadcast gangguan.</p>
              ) : (
                <div className="space-y-2">
                  {broadcasts.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{b.affectedArea}</span>
                        <span className="text-[10px] text-slate-400">{b.sentAt}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{b.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Col: WhatsApp Test Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Uji Coba WhatsApp Gateway</h3>
              <p className="text-xs text-slate-500 mb-4">Tes kirim pesan langsung ke nomor WhatsApp Anda</p>

              {waFeedback && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                  {waFeedback}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor Pengirim Resmi:</label>
                  <input
                    type="text"
                    disabled
                    value={integrations.whatsapp.senderNumber}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor WA Tujuan Uji Coba:</label>
                  <input
                    type="text"
                    value={testWANumber}
                    onChange={e => setTestWANumber(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <button
                  disabled={isTestingWA}
                  onClick={handleTestWA}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${isTestingWA ? 'animate-spin' : ''}`} />
                  <span>Kirim Pesan WhatsApp Test</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Notifikasi Pembayaran Diterima otomatis terkirim setiap kali tagihan dilunasi oleh pelanggan.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TELEGRAM */}
      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Telegram Config as explicitly requested */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konfigurasi Bot Telegram Resmi</h3>
                <p className="text-xs text-slate-500">Menerima alert realtime tagihan lunas, auto-isolir, dan perubahan Wi-Fi</p>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Status:</span>
                <button
                  onClick={() => {
                    updateIntegrations({
                      telegram: {
                        ...integrations.telegram,
                        status: !integrations.telegram.status
                      }
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    integrations.telegram.status
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {integrations.telegram.status ? 'Aktif' : 'Non-aktif'}
                </button>
              </div>
            </div>

            {telegramFeedback && (
              <div className="p-4 bg-sky-50 border border-sky-200 text-sky-900 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{telegramFeedback}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tokenbot Telegram</label>
                <input
                  type="text"
                  value={integrations.telegram.tokenBot}
                  onChange={e => {
                    updateIntegrations({
                      telegram: { ...integrations.telegram, tokenBot: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">usernamebot</label>
                  <input
                    type="text"
                    value={integrations.telegram.usernameBot}
                    onChange={e => {
                      updateIntegrations({
                        telegram: { ...integrations.telegram, usernameBot: e.target.value }
                      });
                    }}
                    placeholder="@afafiber_bot"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">username telegram</label>
                  <input
                    type="text"
                    value={integrations.telegram.usernameTelegram}
                    onChange={e => {
                      updateIntegrations({
                        telegram: { ...integrations.telegram, usernameTelegram: e.target.value }
                      });
                    }}
                    placeholder="@afafiber_admin"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">id telegram (Chat ID Pemilik/Admin)</label>
                <input
                  type="text"
                  value={integrations.telegram.idTelegram}
                  onChange={e => {
                    updateIntegrations({
                      telegram: { ...integrations.telegram, idTelegram: e.target.value }
                    });
                  }}
                  placeholder="Contoh: 1849201948"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Kirim payload via Telegram Bot API</span>
                <button
                  type="button"
                  disabled={isTestingTelegram}
                  onClick={handleTestTelegram}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${isTestingTelegram ? 'animate-spin' : ''}`} />
                  <span>Test Kirim Pesan Telegram</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Col: Live Telegram Preview Bubble */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                  TG
                </div>
                <div>
                  <p className="text-xs font-bold">{integrations.telegram.usernameBot}</p>
                  <p className="text-[10px] text-slate-400">Bot AFAFIBER ISP Notification</p>
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="bg-slate-800/90 rounded-2xl rounded-tl-none p-3.5 border border-slate-700/60 text-xs space-y-2">
                <p className="font-bold text-emerald-400">💵 [PAYMENT RECEIVED]</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Tagihan <span className="font-mono text-cyan-300">INV-202611-002</span> oleh Dewi Lestari (AF-002) senilai Rp 250.000 Lunas via BCA Virtual Account.
                </p>
                <p className="text-[10px] text-slate-400 text-right">10:35 AM · Delivered</p>
              </div>

              <div className="mt-3 bg-slate-800/90 rounded-2xl rounded-tl-none p-3.5 border border-slate-700/60 text-xs space-y-2">
                <p className="font-bold text-amber-400">⚠️ [MIKROTIK ISOLIR REPORT]</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1 pelanggan dipindahkan ke pool isolir karena tagihan lewat jatuh tempo.
                </p>
                <p className="text-[10px] text-slate-400 text-right">10:36 AM · Delivered</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Setiap kali transaksi baru selesai, bot otomatis mengirim rincian transaksi ke ID Telegram Anda.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
