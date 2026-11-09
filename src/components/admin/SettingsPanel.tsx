import React, { useState } from 'react';
import {
  Settings,
  Users,
  Image,
  Building,
  CreditCard,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  RotateCcw,
  Shield,
  Key,
  KeyRound,
  Lock
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { UserRole, BankAccount, SystemUser } from '../../types/isp';
import { ChangePasswordModal } from './ChangePasswordModal';

export const SettingsPanel: React.FC = () => {
  const {
    companySettings,
    bankAccounts,
    users,
    updateCompanySettings,
    addBankAccount,
    deleteBankAccount,
    addUser,
    deleteUser,
    resetToDefault
  } = useISP();

  const [activeSection, setActiveSection] = useState<'users' | 'logo' | 'company' | 'banks' | 'terms'>('users');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form: Tambah User
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('admin123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('teknisi');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [passwordModalTarget, setPasswordModalTarget] = useState<SystemUser | null>(null);

  // Form: Company Settings
  const [companyForm, setCompanyForm] = useState({
    name: companySettings.name,
    tagline: companySettings.tagline,
    phone: companySettings.phone,
    csWhatsapp: companySettings.csWhatsapp,
    email: companySettings.email,
    address: companySettings.address,
    operatingHours: companySettings.operatingHours
  });

  // Form: Tambah Bank
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('Bank Central Asia (BCA)');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankHolder, setNewBankHolder] = useState('PT AFAFIBER NUSANTARA');
  const [newBankPrimary, setNewBankPrimary] = useState(false);

  // Form: Terms
  const [termsText, setTermsText] = useState(companySettings.termsAndConditions);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(companyForm);
    showToast('Profil dan informasi perusahaan AFAFIBER berhasil diperbarui.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateCompanySettings({ logoUrl: reader.result });
          showToast('Logo perusahaan berhasil diunggah.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserUsername) return;

    addUser({
      name: newUserName,
      username: newUserUsername,
      password: newUserPassword || 'admin123',
      role: newUserRole,
      phone: newUserPhone || '0812' + Math.floor(10000000 + Math.random() * 90000000),
      email: newUserEmail || `${newUserUsername}@afafiber.net`,
      isActive: true,
      lastLogin: '-'
    });

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('admin123');
    showToast(`Pengguna baru (${newUserName} sebagai ${newUserRole}) berhasil ditambahkan.`);
  };

  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankNumber || !newBankHolder) return;

    addBankAccount({
      bankName: newBankName,
      accountNumber: newBankNumber,
      accountHolder: newBankHolder,
      isPrimary: newBankPrimary
    });

    setIsAddBankOpen(false);
    setNewBankNumber('');
    showToast(`Rekening bank ${newBankName} berhasil ditambahkan.`);
  };

  const handleSaveTerms = () => {
    updateCompanySettings({ termsAndConditions: termsText });
    showToast('Syarat & Ketentuan berlangganan berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Pengaturan Sistem & Profil Perusahaan</h2>
          </div>
          <p className="text-xs text-slate-500">
            Kelola hak akses role petugas, upload logo, data rekening pembayaran bank, dan syarat ketentuan resmi.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Kembalikan semua data ke pengaturan awal demo?')) {
              resetToDefault();
              showToast('Data demo berhasil direset ke kondisi awal.');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Nav Tabs for Settings */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'users'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Role & User Petugas ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('logo')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'logo'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Upload Logo</span>
        </button>

        <button
          onClick={() => setActiveSection('company')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'company'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Tentang Perusahaan</span>
        </button>

        <button
          onClick={() => setActiveSection('banks')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'banks'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Rekening Bank Pembayaran ({bankAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('terms')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'terms'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Syarat & Ketentuan</span>
        </button>
      </div>

      {/* SECTION 1: USERS & ROLES */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manajemen Pengguna & Role Petugas</h3>
              <p className="text-xs text-slate-500">Atur hak akses admin operasional, finance billing, dan teknisi lapangan</p>
            </div>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah User Petugas</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                  <th className="p-3">Nama Petugas</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Role Akses</th>
                  <th className="p-3">Kontak & Email</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 font-mono text-cyan-700">{u.username}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'admin_billing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin_billing' ? 'Admin Billing' : 'Teknisi Jaringan'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{u.phone}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        AKTIF
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setPasswordModalTarget(u)}
                          className="p-1 text-slate-500 hover:text-cyan-700 bg-slate-50 hover:bg-cyan-50 rounded border border-slate-200 transition-colors"
                          title="Ganti / Perbarui Kata Sandi Petugas"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        {users.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus akun ${u.name}?`)) deleteUser(u.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Hapus user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Tambah User */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">Tambah Akun Petugas Baru</h4>
                  <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Petugas</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={e => setNewUserName(e.target.value)}
                      placeholder="Contoh: Farhan Syahputra"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Username Login</label>
                    <input
                      type="text"
                      required
                      value={newUserUsername}
                      onChange={e => setNewUserUsername(e.target.value)}
                      placeholder="farhan_teknisi"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Role / Peran Petugas</label>
                    <select
                      value={newUserRole}
                      onChange={e => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="super_admin">Super Admin (Akses Penuh)</option>
                      <option value="admin_billing">Admin Billing (Keuangan & Tagihan)</option>
                      <option value="teknisi">Teknisi Jaringan (Modem, ODC, ODP & Map)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp Petugas</label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={e => setNewUserPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kata Sandi Login Awal *</label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={newUserPassword}
                      onChange={e => setNewUserPassword(e.target.value)}
                      placeholder="Minimal 6 karakter (contoh: admin123)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Simpan User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Modal for Selected User */}
          {passwordModalTarget && (
            <ChangePasswordModal
              targetUserId={passwordModalTarget.id}
              targetUserName={`${passwordModalTarget.name} (${passwordModalTarget.username})`}
              onClose={() => setPasswordModalTarget(null)}
            />
          )}

        </div>
      )}

      {/* SECTION 2: UPLOAD LOGO */}
      {activeSection === 'logo' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upload & Manajemen Logo Perusahaan</h3>
            <p className="text-xs text-slate-500">
              Logo akan otomatis ditampilkan di header navigasi, faktur tagihan, serta cetak struk pembayaran resmi.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-36 h-24 bg-white rounded-lg border border-slate-300 flex items-center justify-center p-2 shadow-xs overflow-hidden">
              {companySettings.logoUrl ? (
                <img src={companySettings.logoUrl} alt="Logo AFAFIBER" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 bg-cyan-600 text-white rounded-lg flex items-center justify-center font-bold text-lg mx-auto mb-1">
                    AF
                  </div>
                  <span className="text-[10px] text-slate-400">Default Logo</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                <span>Pilih File Gambar Logo (PNG / JPG / SVG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {companySettings.logoUrl && (
                <button
                  onClick={() => {
                    updateCompanySettings({ logoUrl: '' });
                    showToast('Logo direset ke tampilan bawaan AFAFIBER.');
                  }}
                  className="block text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Hapus Logo Kustom (Gunakan Bawaan)
                </button>
              )}

              <p className="text-[11px] text-slate-400">
                Ukuran yang direkomendasikan: Rasio 3:1 atau 1:1, latar belakang transparan (PNG).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TENTANG PERUSAHAAN (NO NPWP!) */}
      {activeSection === 'company' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Edit Profil & Informasi Perusahaan</h3>
            <p className="text-xs text-slate-500">
              Informasi ini akan tercetak pada kuitansi dan profil layanan ISP (Kolom NPWP telah ditiadakan sesuai instruksi).
            </p>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Perusahaan / Brand ISP</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Slogan Perusahaan</label>
                <input
                  type="text"
                  value={companyForm.tagline}
                  onChange={e => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">No. Telepon Kantor</label>
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Service WhatsApp</label>
                <input
                  type="text"
                  value={companyForm.csWhatsapp}
                  onChange={e => setCompanyForm({ ...companyForm, csWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alamat Kantor Operasional</label>
              <textarea
                rows={2}
                value={companyForm.address}
                onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jam Operasional Layanan</label>
              <input
                type="text"
                value={companyForm.operatingHours}
                onChange={e => setCompanyForm({ ...companyForm, operatingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Simpan Profil Perusahaan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 4: REKENING BANK */}
      {activeSection === 'banks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekening Bank Tujuan Pembayaran</h3>
              <p className="text-xs text-slate-500">Daftar rekening yang ditampilkan pada portal pelanggan dan kuitansi tagihan</p>
            </div>
            <button
              onClick={() => setIsAddBankOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekening Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(b => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs">{b.bankName}</span>
                    {b.isPrimary && (
                      <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                        UTAMA
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-base font-bold text-cyan-700">{b.accountNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Atas Nama: <strong className="text-slate-700">{b.accountHolder}</strong></p>
                </div>
                {bankAccounts.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Hapus rekening ${b.bankName}?`)) deleteBankAccount(b.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Modal Tambah Rekening */}
          {isAddBankOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">Tambah Rekening Bank Pembayaran</h4>
                  <button onClick={() => setIsAddBankOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleAddBankSubmit} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Bank / Kanal Pembayaran</label>
                    <input
                      type="text"
                      required
                      value={newBankName}
                      onChange={e => setNewBankName(e.target.value)}
                      placeholder="Contoh: Bank Central Asia (BCA)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      required
                      value={newBankNumber}
                      onChange={e => setNewBankNumber(e.target.value)}
                      placeholder="Contoh: 8735-0982-11"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Atas Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      required
                      value={newBankHolder}
                      onChange={e => setNewBankHolder(e.target.value)}
                      placeholder="PT AFAFIBER NUSANTARA"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="primaryBankCheck"
                      checked={newBankPrimary}
                      onChange={e => setNewBankPrimary(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <label htmlFor="primaryBankCheck" className="text-slate-700 font-medium">
                      Jadikan sebagai rekening pembayaran utama
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddBankOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Simpan Rekening
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SECTION 5: SYARAT DAN KETENTUAN */}
      {activeSection === 'terms' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Syarat dan Ketentuan Berlangganan</h3>
            <p className="text-xs text-slate-500">Ketentuan kontrak legal antara AFAFIBER dan pelanggan internet</p>
          </div>

          <textarea
            rows={8}
            value={termsText}
            onChange={e => setTermsText(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveTerms}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
            >
              Simpan Syarat & Ketentuan
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
