/**
 * Type definitions for AFAFIBER ISP Management System
 */

export type UserRole = 'super_admin' | 'admin_billing' | 'teknisi';

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  phone: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface WifiPackage {
  id: string;
  name: string;
  speed: string; // e.g. "7 Mbps", "15 Mbps", "30 Mbps"
  speedMbps: number;
  price: number; // 150000, 200000, 250000
  description: string;
  features: string[];
}

export type CustomerStatus = 'active' | 'isolated' | 'pending';

export interface Customer {
  id: string; // e.g. AF-0012
  nikKtp: string; // 16 digit NIK KTP
  name: string;
  phone: string; // WhatsApp number
  email: string;
  address: string;
  packageId: string;
  status: CustomerStatus;
  joinDate: string;
  dueDay: number; // 1 - 28 of each month
  odpId: string;
  odcId: string;
  coordinates: [number, number]; // [lat, lng]
  
  // Router / ONT details
  pppoeUsername: string;
  pppoePassword?: string;
  ipAddress: string;
  ontSerial: string;
  ontModel: string;
  opticalRxPower: number; // e.g. -21.4 dBm
  
  // Wi-Fi settings
  wifiSSID: string;
  wifiPassword: string;
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export interface Invoice {
  id: string; // INV-202411-001
  customerId: string;
  customerName: string;
  customerPhone: string;
  packageId: string;
  packageName: string;
  amount: number;
  period: string; // e.g. "November 2026"
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  status: InvoiceStatus;
}

export interface BankAccount {
  id: string;
  bankName: string; // BCA, Mandiri, BRI, BNI, DANA, QRIS
  accountNumber: string;
  accountHolder: string;
  isPrimary?: boolean;
}

export interface ODC {
  id: string;
  name: string;
  coordinates: [number, number];
  capacityPorts: number;
  usedPorts: number;
  locationName: string;
  status: 'normal' | 'maintenance' | 'critical';
}

export interface ODP {
  id: string;
  name: string;
  odcId: string;
  coordinates: [number, number];
  capacityPorts: number;
  usedPorts: number;
  locationName: string;
  status: 'normal' | 'maintenance' | 'critical';
}

export interface CompanySettings {
  name: string;
  tagline: string;
  phone: string;
  csWhatsapp: string;
  email: string;
  address: string;
  operatingHours: string;
  logoUrl: string;
  termsAndConditions: string;
  // NOTE: NPWP explicitly excluded per user requirement
}

export interface EmailIntegration {
  smtpHost: string;
  smtpPort: number;
  secure: boolean;
  senderEmail: string;
  senderName: string;
  password?: string;
  isConnected: boolean;
}

export interface PaymentGatewayIntegration {
  provider: 'midtrans' | 'xendit' | 'tripay';
  merchantId: string;
  clientKey: string;
  serverKey: string;
  isProduction: boolean;
  isActive: boolean;
}

export interface WhatsappIntegration {
  provider: 'fonnte' | 'wablas' | 'wwebjs';
  apiKey: string;
  senderNumber: string;
  billingTemplate: string;
  outageTemplate: string;
  receiptTemplate: string;
  isActive: boolean;
}

export interface MikrotikIntegration {
  host: string;
  port: number;
  username: string;
  password?: string;
  isolirProfile: string;
  isolirPool: string;
  interfaceName: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface TelegramIntegration {
  status: boolean; // Aktif / Non-aktif
  tokenBot: string;
  usernameBot: string;
  usernameTelegram: string;
  idTelegram: string;
}

export interface IntegrationsConfig {
  email: EmailIntegration;
  paymentGateway: PaymentGatewayIntegration;
  whatsapp: WhatsappIntegration;
  mikrotik: MikrotikIntegration;
  telegram: TelegramIntegration;
}

export interface OutageBroadcast {
  id: string;
  title: string;
  affectedArea: string; // e.g. "Semua Wilayah" or "ODC-01 / ODP-04"
  message: string;
  sentAt: string;
  sentCount: number;
}
