import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MapPin,
  Server,
  Cpu,
  Bell,
  Settings,
  Link2,
  LogOut,
  ExternalLink,
  ChevronRight,
  Shield,
  Menu,
  X,
  KeyRound
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import { AdminDashboard } from './AdminDashboard';
import { CustomerManagement } from './CustomerManagement';
import { BillingManagement } from './BillingManagement';
import { FiberMap } from './FiberMap';
import { GenieACSSystem } from './GenieACSSystem';
import { MikrotikSystem } from './MikrotikSystem';
import { NotificationCenter } from './NotificationCenter';
import { SettingsPanel } from './SettingsPanel';
import { IntegrationsPanel } from './IntegrationsPanel';

interface AdminLayoutProps {
  onSwitchToCustomerPortal: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onSwitchToCustomerPortal }) => {
  const { currentAdmin, logoutAdmin, companySettings } = useISP();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Data Pelanggan', icon: Users },
    { id: 'billing', label: 'Tagihan & Isolir', icon: CreditCard },
    { id: 'map', label: 'Peta Fiber ODC/ODP', icon: MapPin },
    { id: 'genieacs', label: 'GenieACS (TR-069)', icon: Server },
    { id: 'mikrotik', label: 'MikroTik RouterOS', icon: Cpu },
    { id: 'notifications', label: 'WhatsApp & Telegram', icon: Bell },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'integrations', label: 'Integrasi API', icon: Link2 }
  ];

  const getBreadcrumbTitle = () => {
    const item = navItems.find(n => n.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {companySettings.logoUrl ? (
                <img src={companySettings.logoUrl} alt={companySettings.name} className="h-7 max-w-[110px] object-contain" />
              ) : (
                <div className="w-7 h-7 rounded bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  AF
                </div>
              )}
              <span className="font-bold text-sm text-white tracking-tight">{companySettings.name}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Badge & Password Trigger */}
          <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{currentAdmin?.name || 'Administrator'}</p>
                <p className="text-[11px] font-mono text-cyan-400">
                  {currentAdmin?.role === 'super_admin' ? 'Super Admin' : currentAdmin?.role === 'admin_billing' ? 'Admin Billing' : 'Teknisi Jaringan'}
                </p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700/60"
                title="Ganti Kata Sandi Admin"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Shortcuts */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onSwitchToCustomerPortal}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
          >
            <span>Buka Portal Pelanggan</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar following Top Bar Contract (§2) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 shadow-2xs">
          
          {/* Zone 1: Mobile toggle & Breadcrumb */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 whitespace-nowrap">
              <span>{companySettings.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Zone 2: Fast Quick Access Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${activeTab === 'dashboard' ? 'text-cyan-700 border-b-2 border-cyan-700' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${activeTab === 'customers' ? 'text-cyan-700 border-b-2 border-cyan-700' : ''}`}
            >
              Pelanggan
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${activeTab === 'billing' ? 'text-cyan-700 border-b-2 border-cyan-700' : ''}`}
            >
              Tagihan
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${activeTab === 'map' ? 'text-cyan-700 border-b-2 border-cyan-700' : ''}`}
            >
              Peta Fiber
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${activeTab === 'integrations' ? 'text-cyan-700 border-b-2 border-cyan-700' : ''}`}
            >
              Integrasi
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-slate-200"
              title="Ganti Kata Sandi Admin"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ganti Sandi</span>
            </button>
            <button
              onClick={onSwitchToCustomerPortal}
              className="px-3.5 py-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Portal Pelanggan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'billing' && <BillingManagement />}
          {activeTab === 'map' && <FiberMap />}
          {activeTab === 'genieacs' && <GenieACSSystem />}
          {activeTab === 'mikrotik' && <MikrotikSystem />}
          {activeTab === 'notifications' && <NotificationCenter />}
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'integrations' && <IntegrationsPanel />}
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
          <p>© 2026 {companySettings.name} ISP Billing & Management Engine.</p>
          <p className="text-[11px] text-slate-400">Map Key Active · Core MikroTik & GenieACS Ready</p>
        </footer>

      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}

    </div>
  );
};
