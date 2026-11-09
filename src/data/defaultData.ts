import {
  WifiPackage,
  Customer,
  Invoice,
  ODC,
  ODP,
  BankAccount,
  CompanySettings,
  IntegrationsConfig,
  SystemUser
} from '../types/isp';

export const MAP_API_KEY = "cb1_54gm_1_43b04e4d07f02edf624a2135";

export const DEFAULT_PACKAGES: WifiPackage[] = [
  {
    id: 'pkg-7mbps',
    name: 'Paket Hemat Fiber',
    speed: '7 Mbps',
    speedMbps: 7,
    price: 150000,
    description: 'Cocok untuk browsing santai, medsos, dan streaming video 1-3 perangkat.',
    features: [
      'Kecepatan download & upload simetris hingga 7 Mbps',
      'Unlimited kuota tanpa batas FUP',
      'Termasuk modem Wi-Fi Dual-Band Router',
      'Bantuan teknisi ramah 24/7'
    ]
  },
  {
    id: 'pkg-15mbps',
    name: 'Paket Keluarga Ceria',
    speed: '15 Mbps',
    speedMbps: 15,
    price: 200000,
    description: 'Paling diminati keluarga! Lancar streaming Full HD, Zoom meeting, dan online gaming.',
    features: [
      'Kecepatan download & upload simetris hingga 15 Mbps',
      'Unlimited tanpa batas kuota',
      'Latency rendah untuk gaming dan video call lancar',
      'Prioritas penanganan keluhan'
    ]
  },
  {
    id: 'pkg-30mbps',
    name: 'Paket Bisnis & Pro Gaming',
    speed: '30 Mbps',
    speedMbps: 30,
    price: 250000,
    description: 'Performa maksimal untuk multi-user, 4K Smart TV, download file besar, dan bisnis rumahan.',
    features: [
      'Kecepatan download & upload simetris hingga 30 Mbps',
      'Koneksi fiber ultra-stabil dengan SLA 99.5%',
      'Bandwidth dedicated untuk prioritas traffic tinggi',
      'Layanan kunjungan teknisi prioritas utama'
    ]
  }
];

export const DEFAULT_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Fajrin Pratama',
    username: 'admin',
    password: 'admin123',
    role: 'super_admin',
    phone: '081298765432',
    email: 'admin@afafiber.net',
    isActive: true,
    lastLogin: '2026-11-09 10:15'
  },
  {
    id: 'usr-2',
    name: 'Siti Rahmawati',
    username: 'billing',
    password: 'billing123',
    role: 'admin_billing',
    phone: '081234567891',
    email: 'billing@afafiber.net',
    isActive: true,
    lastLogin: '2026-11-08 16:40'
  },
  {
    id: 'usr-3',
    name: 'Budi Santoso',
    username: 'teknisi',
    password: 'teknisi123',
    role: 'teknisi',
    phone: '081345678902',
    email: 'teknisi@afafiber.net',
    isActive: true,
    lastLogin: '2026-11-09 09:30'
  }
];

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8735-0982-11',
    accountHolder: 'PT AFAFIBER NUSANTARA',
    isPrimary: true
  },
  {
    id: 'bank-2',
    bankName: 'Bank Mandiri',
    accountNumber: '137-00-982312-4',
    accountHolder: 'PT AFAFIBER NUSANTARA'
  },
  {
    id: 'bank-3',
    bankName: 'Bank Rakyat Indonesia (BRI)',
    accountNumber: '0341-01-002341-50-8',
    accountHolder: 'PT AFAFIBER NUSANTARA'
  },
  {
    id: 'bank-4',
    bankName: 'QRIS Bersama (Semua E-Wallet & M-Banking)',
    accountNumber: 'NMID: ID1020088923180',
    accountHolder: 'AFAFIBER QRIS OTOMATIS'
  }
];

export const DEFAULT_ODCS: ODC[] = [
  {
    id: 'ODC-01',
    name: 'ODC-01 Kebon Jeruk Pusat',
    coordinates: [-6.1895, 106.7725],
    capacityPorts: 144,
    usedPorts: 98,
    locationName: 'Jl. Merdeka Barat No. 12',
    status: 'normal'
  },
  {
    id: 'ODC-02',
    name: 'ODC-02 Pos Pengumben Indah',
    coordinates: [-6.2120, 106.7780],
    capacityPorts: 96,
    usedPorts: 64,
    locationName: 'Jl. Pos Pengumben Blok C',
    status: 'normal'
  }
];

export const DEFAULT_ODPS: ODP[] = [
  {
    id: 'ODP-KJ-01',
    name: 'ODP-KJ-01 RW 02',
    odcId: 'ODC-01',
    coordinates: [-6.1872, 106.7712],
    capacityPorts: 16,
    usedPorts: 14,
    locationName: 'Tiang Telkom No. 14, RT 03/RW 02',
    status: 'normal'
  },
  {
    id: 'ODP-KJ-02',
    name: 'ODP-KJ-02 Dahlia Asri',
    odcId: 'ODC-01',
    coordinates: [-6.1918, 106.7745],
    capacityPorts: 16,
    usedPorts: 12,
    locationName: 'Perum Dahlia Asri Blok B No. 04',
    status: 'normal'
  },
  {
    id: 'ODP-KJ-03',
    name: 'ODP-KJ-03 Kenanga Raya',
    odcId: 'ODC-01',
    coordinates: [-6.1935, 106.7690],
    capacityPorts: 16,
    usedPorts: 8,
    locationName: 'Jl. Kenanga Raya No. 45',
    status: 'normal'
  },
  {
    id: 'ODP-PP-01',
    name: 'ODP-PP-01 Pengumben Barat',
    odcId: 'ODC-02',
    coordinates: [-6.2105, 106.7765],
    capacityPorts: 16,
    usedPorts: 15,
    locationName: 'Tiang PLN Depan Indomaret Pengumben',
    status: 'normal'
  },
  {
    id: 'ODP-PP-02',
    name: 'ODP-PP-02 Griya Indah',
    odcId: 'ODC-02',
    coordinates: [-6.2140, 106.7802],
    capacityPorts: 8,
    usedPorts: 7,
    locationName: 'Komplek Griya Indah Gate 1',
    status: 'normal'
  }
];

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'AF-001',
    nikKtp: '3174021508920003',
    name: 'Ahmad Faisal',
    phone: '081288992211',
    email: 'ahmad.faisal@gmail.com',
    address: 'Jl. Dahlia Asri No. 12, Kebon Jeruk',
    packageId: 'pkg-15mbps',
    status: 'active',
    joinDate: '2024-03-10',
    dueDay: 10,
    odcId: 'ODC-01',
    odpId: 'ODP-KJ-02',
    coordinates: [-6.1912, 106.7751],
    pppoeUsername: 'af-001@afafiber',
    pppoePassword: 'pass' + Math.floor(1000 + Math.random() * 9000),
    ipAddress: '192.168.100.25',
    ontSerial: 'ZTEGC0892A14',
    ontModel: 'ZTE F670L Dual-Band',
    opticalRxPower: -20.4,
    wifiSSID: 'AFAFIBER_FAISAL_5G',
    wifiPassword: 'rumahfaisal2024'
  },
  {
    id: 'AF-002',
    nikKtp: '3174022804890001',
    name: 'Dewi Lestari',
    phone: '081399884433',
    email: 'dewi.lestari@gmail.com',
    address: 'Jl. Kenanga Raya No. 42A, Kebon Jeruk',
    packageId: 'pkg-30mbps',
    status: 'active',
    joinDate: '2024-01-15',
    dueDay: 15,
    odcId: 'ODC-01',
    odpId: 'ODP-KJ-03',
    coordinates: [-6.1930, 106.7684],
    pppoeUsername: 'af-002@afafiber',
    pppoePassword: 'pass' + Math.floor(1000 + Math.random() * 9000),
    ipAddress: '192.168.100.26',
    ontSerial: 'HWTC8891B012',
    ontModel: 'Huawei HG8245W5',
    opticalRxPower: -19.2,
    wifiSSID: 'DEWI_INTERNET_ULTRA',
    wifiPassword: 'dewikreatif2024'
  },
  {
    id: 'AF-003',
    nikKtp: '3174020912950004',
    name: 'Rudi Hartono',
    phone: '085711223344',
    email: 'rudi.hartono@yahoo.com',
    address: 'Jl. Kebon Jeruk RW 02 No. 8',
    packageId: 'pkg-7mbps',
    status: 'isolated',
    joinDate: '2024-05-02',
    dueDay: 5,
    odcId: 'ODC-01',
    odpId: 'ODP-KJ-01',
    coordinates: [-6.1870, 106.7710],
    pppoeUsername: 'af-003@afafiber',
    pppoePassword: 'pass' + Math.floor(1000 + Math.random() * 9000),
    ipAddress: '10.10.10.12',
    ontSerial: 'FH092837AC',
    ontModel: 'Fiberhome AN5506-04',
    opticalRxPower: -22.8,
    wifiSSID: 'AFAFIBER_RUDI',
    wifiPassword: 'rudiwifioke'
  },
  {
    id: 'AF-004',
    nikKtp: '3174021207900007',
    name: 'Hendra Gunawan',
    phone: '081912345678',
    email: 'hendra.gunawan@outlook.com',
    address: 'Komplek Griya Indah No. 28, Pengumben',
    packageId: 'pkg-30mbps',
    status: 'active',
    joinDate: '2024-06-12',
    dueDay: 12,
    odcId: 'ODC-02',
    odpId: 'ODP-PP-02',
    coordinates: [-6.2138, 106.7808],
    pppoeUsername: 'af-004@afafiber',
    pppoePassword: 'pass' + Math.floor(1000 + Math.random() * 9000),
    ipAddress: '192.168.100.28',
    ontSerial: 'ZTEGC1904512',
    ontModel: 'ZTE F670L Dual-Band',
    opticalRxPower: -18.9,
    wifiSSID: 'HENDRA_STUDIO_5G',
    wifiPassword: 'hendragunawan24'
  },
  {
    id: 'AF-005',
    nikKtp: '3174020303880009',
    name: 'Maya Indriani',
    phone: '087890123456',
    email: 'maya.indri@gmail.com',
    address: 'Jl. Pos Pengumben Barat Blok B3',
    packageId: 'pkg-15mbps',
    status: 'active',
    joinDate: '2024-07-20',
    dueDay: 20,
    odcId: 'ODC-02',
    odpId: 'ODP-PP-01',
    coordinates: [-6.2102, 106.7761],
    pppoeUsername: 'af-005@afafiber',
    pppoePassword: 'pass' + Math.floor(1000 + Math.random() * 9000),
    ipAddress: '192.168.100.29',
    ontSerial: 'HWTC99104812',
    ontModel: 'Huawei HG8245W5',
    opticalRxPower: -21.0,
    wifiSSID: 'MAYA_HOME_FIBER',
    wifiPassword: 'mayawifipass'
  }
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'INV-202611-001',
    customerId: 'AF-001',
    customerName: 'Ahmad Faisal',
    customerPhone: '081288992211',
    packageId: 'pkg-15mbps',
    packageName: 'Paket Keluarga Ceria (15 Mbps)',
    amount: 200000,
    period: 'November 2026',
    createdAt: '2026-11-01',
    dueDate: '2026-11-10',
    status: 'unpaid'
  },
  {
    id: 'INV-202610-001',
    customerId: 'AF-001',
    customerName: 'Ahmad Faisal',
    customerPhone: '081288992211',
    packageId: 'pkg-15mbps',
    packageName: 'Paket Keluarga Ceria (15 Mbps)',
    amount: 200000,
    period: 'Oktober 2026',
    createdAt: '2026-10-01',
    dueDate: '2026-10-10',
    paidAt: '2026-10-08 14:22',
    paymentMethod: 'QRIS Bersama Instant',
    status: 'paid'
  },
  {
    id: 'INV-202611-002',
    customerId: 'AF-002',
    customerName: 'Dewi Lestari',
    customerPhone: '081399884433',
    packageId: 'pkg-30mbps',
    packageName: 'Paket Bisnis & Pro Gaming (30 Mbps)',
    amount: 250000,
    period: 'November 2026',
    createdAt: '2026-11-01',
    dueDate: '2026-11-15',
    paidAt: '2026-11-03 09:12',
    paymentMethod: 'BCA Virtual Account',
    status: 'paid'
  },
  {
    id: 'INV-202611-003',
    customerId: 'AF-003',
    customerName: 'Rudi Hartono',
    customerPhone: '085711223344',
    packageId: 'pkg-7mbps',
    packageName: 'Paket Hemat Fiber (7 Mbps)',
    amount: 150000,
    period: 'November 2026',
    createdAt: '2026-11-01',
    dueDate: '2026-11-05',
    status: 'overdue' // Lewat jatuh tempo -> Terisolir otomatis
  },
  {
    id: 'INV-202611-004',
    customerId: 'AF-004',
    customerName: 'Hendra Gunawan',
    customerPhone: '081912345678',
    packageId: 'pkg-30mbps',
    packageName: 'Paket Bisnis & Pro Gaming (30 Mbps)',
    amount: 250000,
    period: 'November 2026',
    createdAt: '2026-11-01',
    dueDate: '2026-11-12',
    status: 'unpaid'
  },
  {
    id: 'INV-202611-005',
    customerId: 'AF-005',
    customerName: 'Maya Indriani',
    customerPhone: '087890123456',
    packageId: 'pkg-15mbps',
    packageName: 'Paket Keluarga Ceria (15 Mbps)',
    amount: 200000,
    period: 'November 2026',
    createdAt: '2026-11-01',
    dueDate: '2026-11-20',
    paidAt: '2026-11-05 11:45',
    paymentMethod: 'Mandiri Transfer',
    status: 'paid'
  }
];

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'AFAFIBER INTERNET',
  tagline: 'Koneksi Fiber Optik Cepat, Stabil & Tanpa Batas',
  phone: '021-58392019',
  csWhatsapp: '081298765432',
  email: 'support@afafiber.net',
  address: 'Jl. Merdeka Fiber No. 88, Kebon Jeruk, Jakarta Barat 11530',
  operatingHours: 'Senin - Minggu: 08.00 - 22.00 WIB (Bantuan Darurat 24 Jam)',
  logoUrl: '',
  termsAndConditions: `1. Tagihan internet diterbitkan setiap awal bulan dan jatuh tempo sesuai tanggal pemasangan awal pelanggan.
2. Pembayaran dapat dilakukan melalui transfer Bank (BCA, Mandiri, BRI) atau QRIS Otomatis.
3. Keterlambatan pembayaran lebih dari 3 hari setelah tanggal jatuh tempo akan mengakibatkan sistem melakukan pembatasan koneksi (isolir) secara otomatis.
4. Perangkat ONT/Modem merupakan fasilitas pinjaman dari AFAFIBER dan wajib dijaga dengan baik.
5. Pelanggan dapat melakukan pengubahan paket dan konfigurasi Wi-Fi secara mandiri melalui Portal Pelanggan resmi AFAFIBER.`
  // NPWP is intentionally removed per user instruction.
};

export const DEFAULT_INTEGRATIONS: IntegrationsConfig = {
  email: {
    smtpHost: 'mail.afafiber.net',
    smtpPort: 465,
    secure: true,
    senderEmail: 'billing@afafiber.net',
    senderName: 'AFAFIBER Billing Notice',
    isConnected: true
  },
  paymentGateway: {
    provider: 'midtrans',
    merchantId: 'M-AFABILL-2024',
    clientKey: 'SB-Mid-client-881273941',
    serverKey: 'SB-Mid-server-994812374',
    isProduction: false,
    isActive: true
  },
  whatsapp: {
    provider: 'fonnte',
    apiKey: 'wA_ApiKey_AFAFIBER_Secure_2026',
    senderNumber: '081298765432',
    billingTemplate: `Halo Bpk/Ibu *{nama}*,\nTagihan internet AFAFIBER ID *{id_pelanggan}* periode *{periode}* sebesar *Rp {nominal}* telah terbit. Jatuh tempo: *{jatuh_tempo}*.\n\nSilakan bayar melalui portal resmi: {link_portal}\nTerima kasih, AFAFIBER`,
    outageTemplate: `PEMBERITAHUAN GANGGUAN FIBER:\nYth. Pelanggan AFAFIBER area *{area}*,\nSaat ini sedang terjadi kendala jaringan/kabel optik pada segmen tersebut. Tim teknisi kami sedang melakukan perbaikan darurat. Estimasi selesai: 2 Jam.\nMohon maaf atas ketidaknyamanannya.`,
    receiptTemplate: `PEMBAYARAN DITERIMA:\nTerima kasih Bpk/Ibu *{nama}*! Tagihan AFAFIBER no. *{no_invoice}* sebesar *Rp {nominal}* telah LUNAS via *{metode}*.\nKoneksi internet Anda aktif lancar.`,
    isActive: true
  },
  mikrotik: {
    host: '103.180.12.5',
    port: 8728,
    username: 'afabill_api',
    isolirProfile: 'profile-isolir',
    isolirPool: 'pool-isolir-10.10.10.0/24',
    interfaceName: 'ether1-gateway',
    isConnected: true,
    lastSync: '2026-11-09 10:20:15'
  },
  telegram: {
    status: true,
    tokenBot: '7192839481:AAH8k2L_z9q8X4w12V-894Jbkc',
    usernameBot: '@afafiber_billing_bot',
    usernameTelegram: '@afafiber_admin',
    idTelegram: '1849201948'
  }
};
