import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Invoice, Customer, CompanySettings, BankAccount } from '../../types/isp';

interface ReceiptModalProps {
  invoice: Invoice;
  customer?: Customer;
  company: CompanySettings;
  bankAccounts: BankAccount[];
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  invoice,
  customer,
  company,
  bankAccounts,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const primaryBank = bankAccounts.find(b => b.isPrimary) || bankAccounts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header Action Bar (Not Printed) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Bukti Transaksi Pembayaran Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Struk
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="print-area" className="p-8 bg-white text-slate-800 text-sm">
          {/* Company Branding & Invoice Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-8 max-w-[120px] object-contain" />
                ) : (
                  <div className="w-7 h-7 bg-cyan-600 text-white rounded flex items-center justify-center font-bold text-base">
                    A
                  </div>
                )}
                <span className="text-xl font-bold tracking-tight text-slate-900">{company.name}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">{company.address}</p>
              <p className="text-xs text-slate-500">CS WA: {company.csWhatsapp} | Email: {company.email}</p>
            </div>
            
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded border border-emerald-200">
                LUNAS / PAID
              </span>
              <p className="mt-2 text-xs font-semibold text-slate-600">No. Kuitansi:</p>
              <p className="font-mono text-sm font-bold text-slate-900">{invoice.id}</p>
            </div>
          </div>

          {/* Info Columns */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block mb-1">DITERBITKAN KEPADA:</span>
              <p className="font-bold text-sm text-slate-900">{invoice.customerName}</p>
              <p className="text-slate-600">ID Pelanggan: <span className="font-mono font-medium">{invoice.customerId}</span></p>
              {customer?.nikKtp && (
                <p className="text-slate-600">NIK KTP: <span className="font-mono">{customer.nikKtp}</span></p>
              )}
              <p className="text-slate-600">No. WhatsApp: {invoice.customerPhone}</p>
              {customer?.address && (
                <p className="text-slate-500 mt-1">{customer.address}</p>
              )}
            </div>

            <div className="text-right">
              <span className="font-semibold text-slate-500 block mb-1">DETAIL TRANSAKSI:</span>
              <p className="text-slate-600">Periode Tagihan: <span className="font-medium text-slate-800">{invoice.period}</span></p>
              <p className="text-slate-600">Tanggal Terbit: <span className="font-medium text-slate-800">{invoice.createdAt}</span></p>
              <p className="text-slate-600">Waktu Bayar: <span className="font-medium text-slate-800">{invoice.paidAt || 'Lunas Otomatis'}</span></p>
              <p className="text-slate-600">Metode: <span className="font-medium text-slate-800">{invoice.paymentMethod || 'Payment Gateway'}</span></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 font-semibold">
                  <th className="text-left py-2">DESKRIPSI LAYANAN</th>
                  <th className="text-center py-2">KECEPATAN</th>
                  <th className="text-center py-2">PERIODE</th>
                  <th className="text-right py-2">JUMLAH (RP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-slate-900">{invoice.packageName}</p>
                    <p className="text-slate-500 text-[11px]">Koneksi Fiber Optik Dedicated Unlimited Tanpa FUP</p>
                  </td>
                  <td className="text-center py-3 font-medium text-slate-700">Dedicated</td>
                  <td className="text-center py-3 text-slate-700">{invoice.period}</td>
                  <td className="text-right py-3 font-mono font-bold text-slate-900">
                    {invoice.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Signature */}
          <div className="pt-4 pb-6 flex items-start justify-between">
            <div className="max-w-[280px]">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Pembayaran Sah & Terverifikasi</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Struk ini merupakan bukti pembayaran tagihan internet yang sah. Terima kasih atas kepercayaan Anda memilih layanan AFAFIBER.
              </p>
              {primaryBank && (
                <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-200">
                  <span className="font-medium text-slate-800 block mb-0.5">Rekening Resmi:</span>
                  <span>{primaryBank.bankName} - {primaryBank.accountNumber} a.n {primaryBank.accountHolder}</span>
                </div>
              )}
            </div>

            <div className="w-52">
              <div className="flex justify-between py-1 text-xs text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">Rp {invoice.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 text-xs text-slate-600">
                <span>PPN (Sudah Termasuk):</span>
                <span className="font-mono">Rp 0</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-300 font-bold text-sm text-slate-900 mt-1">
                <span>TOTAL DIBAYAR:</span>
                <span className="font-mono text-cyan-700">Rp {invoice.amount.toLocaleString('id-ID')}</span>
              </div>

              {/* Digital Stamp */}
              <div className="mt-4 pt-2 text-center border-t border-dashed border-slate-200">
                <div className="inline-block px-3 py-1 text-[11px] font-bold text-emerald-700 border-2 border-emerald-600 rounded rotate-[-2deg] uppercase">
                  VERIFIED AFAFIBER BILLING
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Generated: {invoice.paidAt || new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="no-print flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Bukti Pembayaran
          </button>
        </div>

      </div>
    </div>
  );
};
