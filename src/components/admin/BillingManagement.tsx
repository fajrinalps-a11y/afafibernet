import React, { useState } from 'react';
import {
  CreditCard,
  Send,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  DollarSign,
  MessageCircle,
  Zap
} from 'lucide-react';
import { useISP } from '../../context/ISPContext';
import { Invoice } from '../../types/isp';
import { ReceiptModal } from '../common/ReceiptModal';
import { PaymentGatewayModal } from '../common/PaymentGatewayModal';

export const BillingManagement: React.FC = () => {
  const {
    invoices,
    customers,
    companySettings,
    bankAccounts,
    payInvoice,
    runAutoIsolir,
    sendWhatsAppBillingBlast,
    sendSingleInvoiceWhatsApp
  } = useISP();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  // Modal States
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<Invoice | null>(null);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<Invoice | null>(null);

  // Status feedback
  const [alertFeedback, setAlertFeedback] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  // Financial Stats
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnpaid = invoices.filter(i => i.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const countPaid = invoices.filter(i => i.status === 'paid').length;
  const countUnpaid = invoices.filter(i => i.status !== 'paid').length;
  const countOverdue = invoices.filter(i => i.status === 'overdue').length;

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch =
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerPhone.includes(searchTerm);

    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchPeriod = filterPeriod === 'all' || inv.period === filterPeriod;

    return matchSearch && matchStatus && matchPeriod;
  });

  const handleRunAutoIsolir = () => {
    const res = runAutoIsolir();
    if (res.count > 0) {
      setAlertFeedback({
        type: 'warning',
        text: `Sistem Auto-Isolir Berhasil: ${res.count} pelanggan (${res.affectedNames.join(', ')}) yang terlambat membayar telah dipindahkan ke address-list 'pelanggan-isolir' MikroTik.`
      });
    } else {
      setAlertFeedback({
        type: 'success',
        text: 'Sistem Auto-Isolir: Semua pelanggan dengan tagihan jatuh tempo telah lunas atau sudah dalam status isolir.'
      });
    }
    setTimeout(() => setAlertFeedback(null), 6000);
  };

  const handleBlastWhatsApp = () => {
    const count = sendWhatsAppBillingBlast();
    setAlertFeedback({
      type: 'success',
      text: `Berhasil mengirim ${count} pesan notifikasi tagihan otomatis via WhatsApp Gateway ke seluruh pelanggan yang belum bayar.`
    });
    setTimeout(() => setAlertFeedback(null), 5000);
  };

  const handleSingleWA = (invId: string) => {
    sendSingleInvoiceWhatsApp(invId);
    setAlertFeedback({
      type: 'success',
      text: `Notifikasi tagihan invoice ${invId} berhasil dikirimkan via WhatsApp.`
    });
    setTimeout(() => setAlertFeedback(null), 4000);
  };

  const handlePaymentSuccess = (method: string) => {
    if (selectedPaymentInvoice) {
      payInvoice(selectedPaymentInvoice.id, method);
      const updated = {
        ...selectedPaymentInvoice,
        status: 'paid' as const,
        paymentMethod: method,
        paidAt: new Date().toLocaleString('id-ID')
      };
      setSelectedPaymentInvoice(null);
      setSelectedReceiptInvoice(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Tagihan Diterbitkan</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <p className="font-mono text-xl font-bold text-slate-900">Rp {totalInvoiced.toLocaleString('id-ID')}</p>
          <p className="text-[11px] text-slate-400 mt-1">{invoices.length} Total Invoice</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-600">Pendapatan Masuk (Lunas)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-mono text-xl font-bold text-emerald-700">Rp {totalPaid.toLocaleString('id-ID')}</p>
          <p className="text-[11px] text-slate-400 mt-1">{countPaid} Invoice Terbayar</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-600">Tertunggak / Belum Bayar</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono text-xl font-bold text-amber-700">Rp {totalUnpaid.toLocaleString('id-ID')}</p>
          <p className="text-[11px] text-slate-400 mt-1">{countUnpaid} Menunggu Pelunasan</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-red-600">Lewat Jatuh Tempo</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-mono text-xl font-bold text-red-700">{countOverdue} Pelanggan</p>
          <p className="text-[11px] text-slate-400 mt-1">Sasaran Auto-Isolir MikroTik</p>
        </div>

      </div>

      {/* Action Banner: WhatsApp Blast & Auto-Isolir Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-5 rounded-xl border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Otomasi Billing & Isolir Jaringan</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Kirim tagihan otomatis via WhatsApp secara massal atau jalankan isolir otomatis bagi pelanggan telat bayar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleBlastWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Notifikasi Tagihan WA Massal</span>
          </button>

          <button
            onClick={handleRunAutoIsolir}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Jalankan Auto-Isolir MikroTik</span>
          </button>
        </div>
      </div>

      {/* Alert Feedback Toast */}
      {alertFeedback && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
          alertFeedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {alertFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{alertFeedback.text}</span>
        </div>
      )}

      {/* Filter and Invoices List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari No. Tagihan, Nama Pelanggan, ID, No. WA..."
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
              <option value="paid">Lunas</option>
              <option value="unpaid">Belum Bayar</option>
              <option value="overdue">Jatuh Tempo (Isolir)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="p-3.5">No. Invoice</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Paket & Periode</th>
                <th className="p-3.5 text-right">Nominal</th>
                <th className="p-3.5">Jatuh Tempo</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Aksi Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const customer = customers.find(c => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 block">{inv.id}</span>
                      <span className="text-[10px] text-slate-400">Terbit: {inv.createdAt}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{inv.customerName}</span>
                      <span className="font-mono text-[11px] text-cyan-700 block">{inv.customerId}</span>
                      <span className="text-[11px] text-slate-500">{inv.customerPhone}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-slate-800 block">{inv.packageName}</span>
                      <span className="text-[11px] text-slate-500">{inv.period}</span>
                    </td>

                    <td className="p-3.5 text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </span>
                      {inv.paymentMethod && (
                        <span className="text-[10px] text-emerald-600 block">{inv.paymentMethod}</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-700 font-medium block">{inv.dueDate}</span>
                      {inv.paidAt && (
                        <span className="text-[10px] text-slate-400">Dibayar: {inv.paidAt}</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inv.status === 'paid' ? 'LUNAS' : inv.status === 'overdue' ? 'JATUH TEMPO' : 'BELUM BAYAR'}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {inv.status !== 'paid' ? (
                          <>
                            <button
                              onClick={() => setSelectedPaymentInvoice(inv)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
                              title="Bayar tagihan via Payment Gateway"
                            >
                              Bayar
                            </button>
                            <button
                              onClick={() => handleSingleWA(inv.id)}
                              className="p-1 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded border border-slate-200 transition-colors"
                              title="Kirim notifikasi tagihan ke WhatsApp pelanggan"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedReceiptInvoice(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-cyan-700 bg-white hover:bg-cyan-50 rounded border border-slate-200 transition-colors"
                            title="Cetak Struk Resmi Bukti Bayar"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Struk</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Receipt Modal (Without Mikrotik/GenieACS Mention) */}
      {selectedReceiptInvoice && (
        <ReceiptModal
          invoice={selectedReceiptInvoice}
          customer={customers.find(c => c.id === selectedReceiptInvoice.customerId)}
          company={companySettings}
          bankAccounts={bankAccounts}
          onClose={() => setSelectedReceiptInvoice(null)}
        />
      )}

      {/* Payment Gateway Modal */}
      {selectedPaymentInvoice && (
        <PaymentGatewayModal
          invoice={selectedPaymentInvoice}
          bankAccounts={bankAccounts}
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedPaymentInvoice(null)}
        />
      )}

    </div>
  );
};
