import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  KeyRound,
  Wifi,
  Power,
  Shield,
  ShieldAlert,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  ArrowUpDown,
  Smartphone,
  MapPin,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { Customer, CustomerStatus } from '../../types/isp';

export const CustomerManagement: React.FC = () => {
  const {
    customers,
    packages,
    odcs,
    odps,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerIsolir,
    updateWifiSettings
  } = useISP();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPackage, setFilterPackage] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [wifiModalCustomer, setWifiModalCustomer] = useState<Customer | null>(null);
  const [wifiFormPassword, setWifiFormPassword] = useState('');
  const [wifiFormSSID, setWifiFormSSID] = useState('');

  // Form State for Adding Customer (WITH NIK KTP as required!)
  const [formData, setFormData] = useState({
    nikKtp: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    packageId: packages[0].id,
    odcId: odcs[0]?.id || 'ODC-01',
    odpId: odps[0]?.id || 'ODP-KJ-01',
    lat: -6.1920,
    lng: 106.7730,
    dueDay: 10,
    pppoeUsername: '',
    ontModel: 'ZTE F670L Dual-Band',
    ontSerial: '',
    opticalRxPower: -20.5,
    wifiSSID: '',
    wifiPassword: ''
  });

  const [formError, setFormError] = useState('');

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nikKtp.includes(searchTerm) ||
      c.phone.includes(searchTerm);

    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPkg = filterPackage === 'all' || c.packageId === filterPackage;

    return matchSearch && matchStatus && matchPkg;
  });

  const handleOpenAddModal = () => {
    setFormData({
      nikKtp: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      packageId: packages[0].id,
      odcId: odcs[0]?.id || 'ODC-01',
      odpId: odps[0]?.id || 'ODP-KJ-01',
      lat: -6.1920,
      lng: 106.7730,
      dueDay: 10,
      pppoeUsername: '',
      ontModel: 'ZTE F670L Dual-Band',
      ontSerial: 'ZTE' + Math.floor(10000000 + Math.random() * 90000000),
      opticalRxPower: -20.5,
      wifiSSID: '',
      wifiPassword: 'afafiber' + Math.floor(100 + Math.random() * 900)
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nikKtp || formData.nikKtp.length !== 16 || !/^\d+$/.test(formData.nikKtp)) {
      setFormError('NIK KTP harus terdiri dari tepat 16 digit angka sesuai KTP.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Nama dan Nomor WhatsApp wajib diisi.');
      return;
    }

    addCustomer({
      nikKtp: formData.nikKtp,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: formData.address,
      packageId: formData.packageId,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      dueDay: Number(formData.dueDay),
      odcId: formData.odcId,
      odpId: formData.odpId,
      coordinates: [Number(formData.lat), Number(formData.lng)],
      pppoeUsername: formData.pppoeUsername || `cust-${Date.now().toString().slice(-4)}@afafiber`,
      ipAddress: `192.168.100.${Math.floor(20 + Math.random() * 80)}`,
      ontSerial: formData.ontSerial || 'ONT' + Date.now().toString().slice(-6),
      ontModel: formData.ontModel,
      opticalRxPower: Number(formData.opticalRxPower),
      wifiSSID: formData.wifiSSID || `AFAFIBER_${formData.name.split(' ')[0].toUpperCase()}`,
      wifiPassword: formData.wifiPassword || 'afafiber123'
    });

    setIsAddModalOpen(false);
  };

  const handleOpenWifiModal = (c: Customer) => {
    setWifiModalCustomer(c);
    setWifiFormSSID(c.wifiSSID);
    setWifiFormPassword(c.wifiPassword);
  };

  const handleSaveWifiModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiModalCustomer) return;
    updateWifiSettings(wifiModalCustomer.id, wifiFormSSID, wifiFormPassword);
    setWifiModalCustomer(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Data Pelanggan AFAFIBER</h2>
          <p className="text-xs text-slate-500">Kelola informasi pelanggan, NIK KTP, kontrol router, dan status isolir</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama, ID Pelanggan, NIK KTP, No. WA..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="isolated">Terisolir</option>
          </select>

          <select
            value={filterPackage}
            onChange={e => setFilterPackage(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
          >
            <option value="all">Semua Paket</option>
            {packages.map(p => (
              <option key={p.id} value={p.id}>{p.speed} - Rp {p.price.toLocaleString('id-ID')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="p-3.5">ID / NIK KTP</th>
                <th className="p-3.5">Nama & Kontak</th>
                <th className="p-3.5">Paket Internet</th>
                <th className="p-3.5">Distribusi ODP</th>
                <th className="p-3.5">Modem & Rx Power</th>
                <th className="p-3.5 text-center">Status Isolir</th>
                <th className="p-3.5 text-right">Kontrol Langsung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data pelanggan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const pkg = packages.find(p => p.id === cust.packageId);
                  const isIsolated = cust.status === 'isolated';

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-cyan-700 block">{cust.id}</span>
                        <span className="font-mono text-[11px] text-slate-600 block mt-0.5">
                          NIK: {cust.nikKtp}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{cust.name}</span>
                        <span className="text-[11px] text-slate-500 block">{cust.phone}</span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]" title={cust.address}>
                          {cust.address}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{pkg?.speed || '-'}</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Rp {pkg?.price.toLocaleString('id-ID')} / bln
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 block">{cust.odpId}</span>
                        <span className="text-[11px] text-slate-400 block">{cust.odcId}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-slate-700">{cust.ontModel}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-400">Rx:</span>
                          <span className={`font-mono font-semibold text-[11px] ${
                            cust.opticalRxPower < -24 ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {cust.opticalRxPower} dBm
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleCustomerIsolir(cust.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            isIsolated
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Klik untuk ubah status isolir MikroTik"
                        >
                          {isIsolated ? (
                            <>
                              <ShieldAlert className="w-3 h-3 text-red-600" />
                              <span>TERISOLIR</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>AKTIF</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenWifiModal(cust)}
                            className="p-1.5 text-slate-600 hover:text-cyan-700 bg-slate-50 hover:bg-cyan-50 rounded border border-slate-200 transition-colors"
                            title="Ganti Password & SSID Wi-Fi Pelanggan Langsung"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data pelanggan ${cust.name}?`)) {
                                deleteCustomer(cust.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                            title="Hapus Pelanggan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Pelanggan Baru (Includes NIK KTP!) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">Registrasi Pelanggan Baru AFAFIBER</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              
              {/* NIK KTP Field - Crucial User Requirement */}
              <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100">
                <label className="text-xs font-bold text-cyan-950 block mb-1">
                  Nomor Induk Kependudukan (NIK KTP Pelanggan) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={formData.nikKtp}
                  onChange={e => setFormData({ ...formData, nikKtp: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="Masukkan 16 digit NIK KTP resmi pelanggan (contoh: 3174021508920003)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-mono font-bold text-slate-900"
                />
                <p className="text-[11px] text-cyan-700 mt-1">
                  Wajib 16 digit angka sebagai identitas kontrak legal berlangganan internet.
                </p>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lengkap Pelanggan *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama sesuai KTP"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">No. WhatsApp Pelanggan *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxxxxxx (Untuk notif tagihan & gangguan)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Lengkap Pemasangan *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. / RT / RW / Nomor Rumah / Komplek"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Package & Billing Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pilihan Paket Fiber *</label>
                  <select
                    value={formData.packageId}
                    onChange={e => setFormData({ ...formData, packageId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.speed} - Rp {p.price.toLocaleString('id-ID')} ({p.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tanggal Jatuh Tempo Bulanan</label>
                  <select
                    value={formData.dueDay}
                    onChange={e => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                  >
                    {[5, 10, 15, 20, 25].map(d => (
                      <option key={d} value={d}>Setiap Tanggal {d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Network ODP Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hubungkan ke ODP Terdekat</label>
                  <select
                    value={formData.odpId}
                    onChange={e => {
                      const selOdp = odps.find(o => o.id === e.target.value);
                      setFormData({
                        ...formData,
                        odpId: e.target.value,
                        odcId: selOdp?.odcId || formData.odcId
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                  >
                    {odps.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.id}) - Port {o.usedPorts}/{o.capacityPorts}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tipe ONT Modem (GenieACS)</label>
                  <select
                    value={formData.ontModel}
                    onChange={e => setFormData({ ...formData, ontModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                  >
                    <option value="ZTE F670L Dual-Band">ZTE F670L Dual-Band</option>
                    <option value="Huawei HG8245W5">Huawei HG8245W5</option>
                    <option value="Fiberhome AN5506-04">Fiberhome AN5506-04</option>
                    <option value="VSOL V2804AX">VSOL V2804AX Wi-Fi 6</option>
                  </select>
                </div>
              </div>

              {/* Initial Wi-Fi Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">SSID / Nama Wi-Fi Awal</label>
                  <input
                    type="text"
                    value={formData.wifiSSID}
                    onChange={e => setFormData({ ...formData, wifiSSID: e.target.value })}
                    placeholder="Contoh: AFAFIBER_NAMA"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Password Wi-Fi Awal</label>
                  <input
                    type="text"
                    value={formData.wifiPassword}
                    onChange={e => setFormData({ ...formData, wifiPassword: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-xs"
                >
                  Simpan Pelanggan Baru
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Admin Ganti Password Wi-Fi & SSID Pelanggan Langsung */}
      {wifiModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">Ganti Password Wi-Fi Pelanggan</h3>
              </div>
              <button
                onClick={() => setWifiModalCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWifiModal} className="p-6 space-y-4">
              <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p>Pelanggan: <strong className="text-slate-900">{wifiModalCustomer.name}</strong> ({wifiModalCustomer.id})</p>
                <p className="mt-0.5">Modem ONT: <span className="font-mono">{wifiModalCustomer.ontModel} ({wifiModalCustomer.ontSerial})</span></p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Wi-Fi (SSID)</label>
                <input
                  type="text"
                  required
                  value={wifiFormSSID}
                  onChange={e => setWifiFormSSID(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password Wi-Fi Baru</label>
                <input
                  type="text"
                  required
                  minLength={8}
                  value={wifiFormPassword}
                  onChange={e => setWifiFormPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Perubahan akan langsung di-push ke modem ONT via protokol TR-069.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWifiModalCustomer(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-xs"
                >
                  Push Konfigurasi ke ONT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
