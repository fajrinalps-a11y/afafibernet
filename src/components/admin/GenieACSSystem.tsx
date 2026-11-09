import React, { useState } from 'react';
import {
  Server,
  RefreshCw,
  Power,
  Wifi,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sliders,
  Activity,
  KeyRound
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { Customer } from '../../types/isp';

export const GenieACSSystem: React.FC = () => {
  const { customers, updateWifiSettings } = useISP();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rebootingId, setRebootingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Edit Wi-Fi Modal
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [formSSID, setFormSSID] = useState('');
  const [formPass, setFormPass] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActionFeedback('Parameter ONT seluruh pelanggan berhasil disinkronkan dari server GenieACS TR-069.');
      setTimeout(() => setActionFeedback(null), 4000);
    }, 800);
  };

  const handleRebootONT = (customerId: string, model: string) => {
    setRebootingId(customerId);
    setTimeout(() => {
      setRebootingId(null);
      setActionFeedback(`Perintah Reboot ONT (${model}) pelanggan ID ${customerId} berhasil dieksekusi via TR-069 RPC.`);
      setTimeout(() => setActionFeedback(null), 4500);
    }, 1200);
  };

  const handleOpenWifiModal = (c: Customer) => {
    setSelectedCust(c);
    setFormSSID(c.wifiSSID);
    setFormPass(c.wifiPassword);
  };

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCust) return;
    updateWifiSettings(selectedCust.id, formSSID, formPass);
    setActionFeedback(`SSID & Password Wi-Fi pelanggan ${selectedCust.name} berhasil di-push ke ONT via TR-069.`);
    setSelectedCust(null);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Manajemen Perangkat ONT (GenieACS TR-069)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring redaman optik (Rx Power), remote reboot modem, konfigurasi SSID & password Wi-Fi secara otomatis.
          </p>
        </div>

        <button
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Device Parameters</span>
        </button>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* GenieACS Server Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Status Server TR-069</span>
          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-4 h-4" /> ONLINE (Port 7547)
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Total Modem Terhubung</span>
          <span className="text-sm font-bold text-slate-900 mt-1 font-mono">{customers.length} ONT Modems</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Kualitas Redaman Rata-rata</span>
          <span className="text-sm font-bold text-emerald-600 mt-1 font-mono">-20.46 dBm (Optimal)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Inform Periodic Interval</span>
          <span className="text-sm font-bold text-cyan-700 mt-1 font-mono">300 Detik</span>
        </div>
      </div>

      {/* ONT Device Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Daftar ONT Pelanggan Aktif</h3>
          <span className="text-xs text-slate-500">Protokol: TR-069 / CWMP v1.4</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Model ONT / Serial Number</th>
                <th className="p-3.5">Redaman (Rx Power)</th>
                <th className="p-3.5">Nama Wi-Fi (SSID)</th>
                <th className="p-3.5">Password Wi-Fi</th>
                <th className="p-3.5 text-center">Status Link</th>
                <th className="p-3.5 text-right">Aksi Remote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(cust => {
                const isRebooting = rebootingId === cust.id;
                const isOpticNormal = cust.opticalRxPower >= -24;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{cust.name}</span>
                      <span className="font-mono text-cyan-700 text-[11px]">{cust.id}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{cust.ontModel}</span>
                      <span className="font-mono text-[11px] text-slate-500">SN: {cust.ontSerial}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-sm ${isOpticNormal ? 'text-emerald-700' : 'text-red-600'}`}>
                          {cust.opticalRxPower} dBm
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {isOpticNormal ? 'Sangat Baik' : 'Redaman Tinggi'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {cust.wifiSSID}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {cust.wifiPassword}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {cust.status === 'active' ? 'GPON UP' : 'RESTRICTED'}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenWifiModal(cust)}
                          className="p-1.5 text-slate-600 hover:text-cyan-700 bg-white hover:bg-cyan-50 rounded border border-slate-200 transition-colors"
                          title="Ganti SSID & Password Wi-Fi"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isRebooting}
                          onClick={() => handleRebootONT(cust.id, cust.ontModel)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 rounded border border-slate-200 transition-colors"
                          title="Kirim perintah Reboot ke ONT"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isRebooting ? 'animate-spin text-red-600' : ''}`} />
                          <span>{isRebooting ? 'Rebooting...' : 'Reboot'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Push Wi-Fi Parameters via GenieACS */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">Push Parameter Wi-Fi (TR-069)</h3>
              </div>
              <button onClick={() => setSelectedCust(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWifi} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <p>Pelanggan: <strong>{selectedCust.name}</strong> ({selectedCust.id})</p>
                <p className="text-slate-500 font-mono text-[11px] mt-0.5">SN: {selectedCust.ontSerial} | Model: {selectedCust.ontModel}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Parameter SSID (InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID)
                </label>
                <input
                  type="text"
                  required
                  value={formSSID}
                  onChange={e => setFormSSID(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Parameter Key (InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase)
                </label>
                <input
                  type="text"
                  required
                  minLength={8}
                  value={formPass}
                  onChange={e => setFormPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCust(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-xs"
                >
                  Set Parameter Values
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
