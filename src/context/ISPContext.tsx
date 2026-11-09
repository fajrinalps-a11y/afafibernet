import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  Invoice,
  WifiPackage,
  ODC,
  ODP,
  BankAccount,
  CompanySettings,
  IntegrationsConfig,
  SystemUser,
  OutageBroadcast
} from '../types/isp';
import {
  DEFAULT_CUSTOMERS,
  DEFAULT_INVOICES,
  DEFAULT_PACKAGES,
  DEFAULT_ODCS,
  DEFAULT_ODPS,
  DEFAULT_BANK_ACCOUNTS,
  DEFAULT_COMPANY_SETTINGS,
  DEFAULT_INTEGRATIONS,
  DEFAULT_USERS
} from '../data/defaultData';

interface ISPContextType {
  // Current Sessions
  currentAdmin: SystemUser | null;
  currentCustomer: Customer | null;
  loginAdmin: (username: string, passwordAttempt?: string) => boolean;
  logoutAdmin: () => void;
  loginCustomer: (identifier: string) => boolean;
  logoutCustomer: () => void;
  changeAdminPassword: (userId: string, oldPass: string, newPass: string) => { success: boolean; message: string };
  resetUserPassword: (userId: string, newPass: string) => void;

  // Data
  customers: Customer[];
  invoices: Invoice[];
  packages: WifiPackage[];
  odcs: ODC[];
  odps: ODP[];
  bankAccounts: BankAccount[];
  companySettings: CompanySettings;
  integrations: IntegrationsConfig;
  users: SystemUser[];
  broadcasts: OutageBroadcast[];
  notificationLogs: Array<{ id: string; type: 'wa' | 'telegram' | 'email'; target: string; message: string; timestamp: string }>;

  // Customer Actions
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  toggleCustomerIsolir: (id: string) => void;
  updateWifiSettings: (customerId: string, ssid: string, pass: string) => boolean;
  changePackage: (customerId: string, packageId: string) => boolean;

  // Invoice & Billing Actions
  payInvoice: (invoiceId: string, paymentMethod: string) => void;
  runAutoIsolir: () => { count: number; affectedNames: string[] };
  sendWhatsAppBillingBlast: () => number;
  sendSingleInvoiceWhatsApp: (invoiceId: string) => boolean;

  // Broadcasts
  sendOutageNotification: (area: string, message: string) => void;

  // Settings & Integrations
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  updateBankAccounts: (accounts: BankAccount[]) => void;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  deleteBankAccount: (id: string) => void;
  updateIntegrations: (updates: Partial<IntegrationsConfig>) => void;
  addUser: (user: Omit<SystemUser, 'id'>) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;

  // Testing & Simulation
  testTelegram: () => Promise<{ success: boolean; message: string }>;
  testWhatsapp: (targetNumber?: string) => Promise<{ success: boolean; message: string }>;
  testMikrotikSync: () => Promise<{ success: boolean; message: string }>;
  resetToDefault: () => void;
}

const ISPContext = createContext<ISPContextType | null>(null);

const STORAGE_KEYS = {
  CUSTOMERS: 'afafiber_customers_v1',
  INVOICES: 'afafiber_invoices_v1',
  COMPANY: 'afafiber_company_v1',
  BANKS: 'afafiber_banks_v1',
  INTEGRATIONS: 'afafiber_integrations_v1',
  USERS: 'afafiber_users_v1',
  BROADCASTS: 'afafiber_broadcasts_v1',
  CURRENT_ADMIN: 'afafiber_admin_session_v1',
  CURRENT_CUSTOMER: 'afafiber_customer_session_v1'
};

export const ISPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or defaults
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : DEFAULT_INVOICES;
  });

  const [packages] = useState<WifiPackage[]>(DEFAULT_PACKAGES);
  const [odcs] = useState<ODC[]>(DEFAULT_ODCS);
  const [odps] = useState<ODP[]>(DEFAULT_ODPS);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANKS);
    return saved ? JSON.parse(saved) : DEFAULT_BANK_ACCOUNTS;
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return saved ? JSON.parse(saved) : DEFAULT_COMPANY_SETTINGS;
  });

  const [integrations, setIntegrations] = useState<IntegrationsConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    return saved ? JSON.parse(saved) : DEFAULT_INTEGRATIONS;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [broadcasts, setBroadcasts] = useState<OutageBroadcast[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationLogs, setNotificationLogs] = useState<Array<{
    id: string;
    type: 'wa' | 'telegram' | 'email';
    target: string;
    message: string;
    timestamp: string;
  }>>([]);

  // Admin and Customer Auth
  const [currentAdmin, setCurrentAdmin] = useState<SystemUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return saved ? JSON.parse(saved) : DEFAULT_USERS[0]; // Default logged-in as Super Admin for direct access
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  }, [currentAdmin]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    }
  }, [currentCustomer]);

  // Auth Functions
  const loginAdmin = (username: string, passwordAttempt?: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (found) {
      if (passwordAttempt && found.password && found.password !== passwordAttempt) {
        return false;
      }
      setCurrentAdmin(found);
      return true;
    }
    // Allow fallback admin
    const defaultAdm = DEFAULT_USERS[0];
    setCurrentAdmin(defaultAdm);
    return true;
  };

  const changeAdminPassword = (userId: string, oldPass: string, newPass: string): { success: boolean; message: string } => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User tidak ditemukan.' };
    }
    const currentSavedPass = user.password || 'admin123';
    if (oldPass !== currentSavedPass) {
      return { success: false, message: 'Kata sandi lama yang Anda masukkan tidak sesuai.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (currentAdmin && currentAdmin.id === userId) {
      setCurrentAdmin(prev => prev ? { ...prev, password: newPass } : null);
    }

    setNotificationLogs(prev => [{
      id: 'log-pass-' + Date.now(),
      type: 'telegram',
      target: integrations.telegram.usernameBot,
      message: `🔐 [SECURITY ALERT] Kata sandi akun admin ${user.username} (${user.name}) berhasil diperbarui oleh pengguna.`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  };

  const resetUserPassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (currentAdmin && currentAdmin.id === userId) {
      setCurrentAdmin(prev => prev ? { ...prev, password: newPass } : null);
    }
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  const loginCustomer = (identifier: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = customers.find(c => 
      c.id.toLowerCase() === cleanId || 
      c.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '') ||
      c.nikKtp.trim() === cleanId ||
      c.email.toLowerCase() === cleanId
    );
    if (found) {
      setCurrentCustomer(found);
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer => {
    const nextNumber = customers.length + 1;
    const newId = `AF-${String(nextNumber).padStart(3, '0')}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId
    };

    setCustomers(prev => [newCustomer, ...prev]);

    // Also auto-generate initial invoice for new customer
    const selectedPkg = packages.find(p => p.id === newCustomer.packageId) || packages[0];
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${newId}`,
      customerId: newId,
      customerName: newCustomer.name,
      customerPhone: newCustomer.phone,
      packageId: selectedPkg.id,
      packageName: `${selectedPkg.name} (${selectedPkg.speed})`,
      amount: selectedPkg.price,
      period: 'Bulan Pertama',
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'unpaid'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (currentCustomer && currentCustomer.id === id) {
      setCurrentCustomer(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (currentCustomer && currentCustomer.id === id) {
      setCurrentCustomer(null);
    }
  };

  const toggleCustomerIsolir = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'isolated' ? 'active' : 'isolated';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Self-Service Wi-Fi SSID & Password changer
  const updateWifiSettings = (customerId: string, ssid: string, pass: string): boolean => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, wifiSSID: ssid, wifiPassword: pass };
      }
      return c;
    }));

    if (currentCustomer && currentCustomer.id === customerId) {
      setCurrentCustomer(prev => prev ? { ...prev, wifiSSID: ssid, wifiPassword: pass } : null);
    }

    // Add notification log
    setNotificationLogs(prev => [{
      id: 'log-' + Date.now(),
      type: 'telegram',
      target: integrations.telegram.usernameBot,
      message: `[GenieACS Push] Perubahan SSID/Password Wifi pelanggan ID ${customerId} berhasil di-provisioning ke ONT Modem.`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return true;
  };

  // Self-Service Package Change
  const changePackage = (customerId: string, packageId: string): boolean => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return false;

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, packageId };
      }
      return c;
    }));

    if (currentCustomer && currentCustomer.id === customerId) {
      setCurrentCustomer(prev => prev ? { ...prev, packageId } : null);
    }

    setNotificationLogs(prev => [{
      id: 'log-' + Date.now(),
      type: 'telegram',
      target: integrations.telegram.usernameBot,
      message: `[MikroTik Simple Queue] Paket Pelanggan ${customerId} diperbarui ke ${pkg.name} (${pkg.speed}). Kecepatan rate-limit disesuaikan otomatis.`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return true;
  };

  // Invoice & Payment
  const payInvoice = (invoiceId: string, paymentMethod: string) => {
    const nowStr = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    let targetCustId = '';
    let targetAmount = 0;
    let targetCustName = '';

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        targetCustId = inv.customerId;
        targetAmount = inv.amount;
        targetCustName = inv.customerName;
        return {
          ...inv,
          status: 'paid',
          paidAt: nowStr,
          paymentMethod
        };
      }
      return inv;
    }));

    // If customer was isolated due to overdue, automatically restore to active
    if (targetCustId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === targetCustId && c.status === 'isolated') {
          return { ...c, status: 'active' };
        }
        return c;
      }));

      // Send WhatsApp payment confirmation
      const waLog = {
        id: 'wa-pay-' + Date.now(),
        type: 'wa' as const,
        target: targetCustName,
        message: `Terima kasih! Pembayaran invoice ${invoiceId} sebesar Rp ${targetAmount.toLocaleString('id-ID')} via ${paymentMethod} telah berhasil diterima. Status internet Anda AKTIF.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      };

      // Send Telegram notification
      const tgLog = {
        id: 'tg-pay-' + Date.now(),
        type: 'telegram' as const,
        target: integrations.telegram.usernameBot,
        message: `💵 [PAYMENT RECEIVED] Tagihan ${invoiceId} oleh ${targetCustName} (${targetCustId}) senilai Rp ${targetAmount.toLocaleString('id-ID')} Lunas via ${paymentMethod}.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      };

      setNotificationLogs(prev => [waLog, tgLog, ...prev]);
    }
  };

  // Auto-isolir system execution
  const runAutoIsolir = () => {
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue' || (inv.status === 'unpaid' && new Date(inv.dueDate) < new Date()));
    const overdueCustIds = new Set(overdueInvoices.map(inv => inv.customerId));
    
    let affectedCount = 0;
    const affectedNames: string[] = [];

    setCustomers(prev => prev.map(c => {
      if (overdueCustIds.has(c.id) && c.status === 'active') {
        affectedCount++;
        affectedNames.push(c.name);
        return { ...c, status: 'isolated' };
      }
      return c;
    }));

    if (affectedCount > 0) {
      setNotificationLogs(prev => [{
        id: 'log-iso-' + Date.now(),
        type: 'telegram',
        target: integrations.telegram.usernameBot,
        message: `⚠️ [AUTO-ISOLIR MIKROTIK] ${affectedCount} pelanggan dengan tagihan jatuh tempo telah dipindahkan ke address-list 'pelanggan-isolir'. Koneksi dialihkan ke landing page tagihan.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      }, ...prev]);
    }

    return { count: affectedCount, affectedNames };
  };

  // WhatsApp Billing Blast
  const sendWhatsAppBillingBlast = (): number => {
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');
    unpaidInvoices.forEach(inv => {
      setNotificationLogs(prev => [{
        id: 'wa-blast-' + inv.id + '-' + Date.now(),
        type: 'wa',
        target: inv.customerPhone,
        message: `Halo ${inv.customerName}, tagihan AFAFIBER Anda bulan ${inv.period} sebesar Rp ${inv.amount.toLocaleString('id-ID')} jatuh tempo pada ${inv.dueDate}. Silakan lakukan pembayaran agar terhindar dari isolir otomatis.`,
        timestamp: new Date().toLocaleTimeString('id-ID')
      }, ...prev]);
    });
    return unpaidInvoices.length;
  };

  const sendSingleInvoiceWhatsApp = (invoiceId: string): boolean => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    setNotificationLogs(prev => [{
      id: 'wa-single-' + Date.now(),
      type: 'wa',
      target: inv.customerPhone,
      message: `Yth. ${inv.customerName}, invoice internet AFAFIBER (${inv.id}) sejumlah Rp ${inv.amount.toLocaleString('id-ID')} telah diterbitkan. Jatuh tempo: ${inv.dueDate}. Bayar sekarang di portal: https://portal.afafiber.net`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return true;
  };

  // Broadcast Outage
  const sendOutageNotification = (area: string, message: string) => {
    const count = customers.length;
    const newBroadcast: OutageBroadcast = {
      id: 'outage-' + Date.now(),
      title: 'Pemberitahuan Pemeliharaan/Gangguan Jaringan',
      affectedArea: area,
      message,
      sentAt: new Date().toLocaleString('id-ID'),
      sentCount: count
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);

    setNotificationLogs(prev => [{
      id: 'wa-outage-' + Date.now(),
      type: 'wa',
      target: `Broadcast WA (${count} Pelanggan)`,
      message: `[AFAFIBER NOTICE] Info Gangguan area: ${area}. ${message}`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);
  };

  // Settings & Integrations
  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings(prev => ({ ...prev, ...settings }));
  };

  const updateBankAccounts = (accounts: BankAccount[]) => {
    setBankAccounts(accounts);
  };

  const addBankAccount = (acc: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = { ...acc, id: 'bank-' + Date.now() };
    setBankAccounts(prev => [...prev, newAcc]);
  };

  const deleteBankAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
  };

  const updateIntegrations = (updates: Partial<IntegrationsConfig>) => {
    setIntegrations(prev => ({
      ...prev,
      ...updates,
      telegram: updates.telegram ? { ...prev.telegram, ...updates.telegram } : prev.telegram,
      mikrotik: updates.mikrotik ? { ...prev.mikrotik, ...updates.mikrotik } : prev.mikrotik,
      whatsapp: updates.whatsapp ? { ...prev.whatsapp, ...updates.whatsapp } : prev.whatsapp,
      paymentGateway: updates.paymentGateway ? { ...prev.paymentGateway, ...updates.paymentGateway } : prev.paymentGateway,
      email: updates.email ? { ...prev.email, ...updates.email } : prev.email,
    }));
  };

  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = { ...userData, id: 'usr-' + Date.now() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<SystemUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Test Actions
  const testTelegram = async () => {
    await new Promise(r => setTimeout(r, 600));
    const testMsg = `🔔 [TEST NOTIFIKASI BOT TELEGRAM]\nStatus: OK ✅\nBot: ${integrations.telegram.usernameBot}\nID Admin: ${integrations.telegram.idTelegram}\nSistem AFAFIBER terhubung dengan lancar!`;
    
    setNotificationLogs(prev => [{
      id: 'tg-test-' + Date.now(),
      type: 'telegram',
      target: integrations.telegram.idTelegram,
      message: testMsg,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return {
      success: true,
      message: `Pesan uji coba berhasil dikirim ke Telegram Chat ID ${integrations.telegram.idTelegram} via ${integrations.telegram.usernameBot}`
    };
  };

  const testWhatsapp = async (targetNumber?: string) => {
    await new Promise(r => setTimeout(r, 600));
    const num = targetNumber || integrations.whatsapp.senderNumber;
    setNotificationLogs(prev => [{
      id: 'wa-test-' + Date.now(),
      type: 'wa',
      target: num,
      message: `Test koneksi WhatsApp Gateway AFAFIBER berhasil terkirim. Server status: READY.`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }, ...prev]);

    return {
      success: true,
      message: `Pesan WhatsApp uji coba berhasil dikirim ke nomor ${num}`
    };
  };

  const testMikrotikSync = async () => {
    await new Promise(r => setTimeout(r, 700));
    const now = new Date().toLocaleString('id-ID');
    setIntegrations(prev => ({
      ...prev,
      mikrotik: {
        ...prev.mikrotik,
        isConnected: true,
        lastSync: now
      }
    }));
    return {
      success: true,
      message: `Koneksi MikroTik RouterOS (${integrations.mikrotik.host}) berhasil diverifikasi. Active sessions & queue tersinkronisasi.`
    };
  };

  const resetToDefault = () => {
    localStorage.clear();
    setCustomers(DEFAULT_CUSTOMERS);
    setInvoices(DEFAULT_INVOICES);
    setBankAccounts(DEFAULT_BANK_ACCOUNTS);
    setCompanySettings(DEFAULT_COMPANY_SETTINGS);
    setIntegrations(DEFAULT_INTEGRATIONS);
    setUsers(DEFAULT_USERS);
    setBroadcasts([]);
    setCurrentAdmin(DEFAULT_USERS[0]);
    setCurrentCustomer(null);
  };

  return (
    <ISPContext.Provider
      value={{
        currentAdmin,
        currentCustomer,
        loginAdmin,
        logoutAdmin,
        loginCustomer,
        logoutCustomer,
        customers,
        invoices,
        packages,
        odcs,
        odps,
        bankAccounts,
        companySettings,
        integrations,
        users,
        broadcasts,
        notificationLogs,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerIsolir,
        updateWifiSettings,
        changePackage,
        payInvoice,
        runAutoIsolir,
        sendWhatsAppBillingBlast,
        sendSingleInvoiceWhatsApp,
        sendOutageNotification,
        updateCompanySettings,
        updateBankAccounts,
        addBankAccount,
        deleteBankAccount,
        updateIntegrations,
        addUser,
        updateUser,
        deleteUser,
        testTelegram,
        testWhatsapp,
        testMikrotikSync,
        resetToDefault,
        changeAdminPassword,
        resetUserPassword
      }}
    >
      {children}
    </ISPContext.Provider>
  );
};

export const useISP = () => {
  const context = useContext(ISPContext);
  if (!context) {
    throw new Error('useISP must be used within an ISPProvider');
  }
  return context;
};
