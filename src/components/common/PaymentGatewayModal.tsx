import React, { useState } from 'react';
import { X, QrCode, Building, Wallet, CheckCircle, Copy, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { Invoice, BankAccount } from '../../types/isp';

interface PaymentGatewayModalProps {
  invoice: Invoice;
  bankAccounts: BankAccount[];
  onSuccess: (paymentMethod: string) => void;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  invoice,
  bankAccounts,
  onSuccess,
  onClose
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | 'bank' | 'ewallet'>('qris');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const vaNumber = `${selectedBank === 'BCA' ? '88019' : selectedBank === 'Mandiri' ? '89201' : '88209'}${invoice.customerId.replace(/[^0-9]/g, '').padStart(6, '0')}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSimulatePayment = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(methodName);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">AFAFIBER Instant Payment</span>
            <h3 className="text-base font-bold text-slate-900">Pembayaran Tagihan Wifi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Box */}
        <div className="px-6 py-3 bg-cyan-50/70 border-b border-cyan-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Invoice: <span className="font-mono font-medium text-slate-700">{invoice.id}</span></p>
            <p className="text-xs font-semibold text-slate-800">{invoice.packageName} ({invoice.period})</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Tagihan</span>
            <p className="text-lg font-bold font-mono text-cyan-700">Rp {invoice.amount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        <div className="px-6 pt-4">
          <label className="text-xs font-semibold text-slate-600 block mb-2">Pilih Jalur Pembayaran:</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedMethod('qris')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium ${
                selectedMethod === 'qris'
                  ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>QRIS</span>
            </button>
            <button
              onClick={() => setSelectedMethod('va')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium ${
                selectedMethod === 'va'
                  ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>Virtual Acc</span>
            </button>
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium ${
                selectedMethod === 'bank'
                  ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>Transfer Bank</span>
            </button>
            <button
              onClick={() => setSelectedMethod('ewallet')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium ${
                selectedMethod === 'ewallet'
                  ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>E-Wallet</span>
            </button>
          </div>
        </div>

        {/* Selected Channel Details */}
        <div className="p-6">
          {selectedMethod === 'qris' && (
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs mb-3">
                {/* Visual QR Code Pattern */}
                <div className="w-44 h-44 bg-slate-900 p-2 rounded-lg flex flex-col items-center justify-between">
                  <div className="w-full flex justify-between">
                    <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                      <div className="w-4 h-4 bg-cyan-400"></div>
                    </div>
                    <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                      <div className="w-4 h-4 bg-cyan-400"></div>
                    </div>
                  </div>
                  <div className="text-white text-center font-mono font-bold text-[10px] tracking-widest bg-cyan-600/90 px-2 py-0.5 rounded">
                    AFAFIBER-QRIS
                  </div>
                  <div className="w-full flex justify-between items-end">
                    <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                      <div className="w-4 h-4 bg-cyan-400"></div>
                    </div>
                    <div className="w-10 h-10 grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white"></div>
                      <div className="bg-cyan-400"></div>
                      <div className="bg-cyan-400"></div>
                      <div className="bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-1">
                Scan menggunakan BCA Mobile, Livin, BRImo, Dana, GoPay, OVO, atau ShopeePay.
              </p>
              <p className="text-[11px] text-slate-400">NMID: ID1020088923180 · Verifikasi Otomatis Real-time</p>

              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayment('QRIS Instant')}
                className="mt-4 w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menunggu Verifikasi Bank...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Simulasi Scan & Konfirmasi Pembayaran QRIS
                  </>
                )}
              </button>
            </div>
          )}

          {selectedMethod === 'va' && (
            <div>
              <div className="flex gap-2 mb-4">
                {['BCA', 'Mandiri', 'BRI', 'BNI'].map(bank => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                      selectedBank === bank
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Nomor Virtual Account {selectedBank}:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-slate-900">{vaNumber}</span>
                  <button
                    onClick={() => copyToClipboard(vaNumber)}
                    className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium p-1 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === vaNumber ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Nama Akun: <span className="font-semibold text-slate-700">AFAFIBER - {invoice.customerName}</span></p>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayment(`${selectedBank} Virtual Account`)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses Pembayaran Virtual Account...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Simulasi Pembayaran Virtual Account {selectedBank}
                  </>
                )}
              </button>
            </div>
          )}

          {selectedMethod === 'bank' && (
            <div>
              <p className="text-xs text-slate-600 mb-3">Silakan transfer tepat ke salah satu rekening resmi AFAFIBER:</p>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {bankAccounts.map(b => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.bankName}</p>
                      <p className="font-mono text-sm font-semibold text-cyan-700">{b.accountNumber}</p>
                      <p className="text-[11px] text-slate-500">a.n {b.accountHolder}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(b.accountNumber)}
                      className="text-xs text-slate-600 hover:text-cyan-600 p-1.5 rounded border border-slate-200 hover:bg-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayment('Transfer Bank Manual')}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Saya Sudah Transfer (Konfirmasi Otomatis)
              </button>
            </div>
          )}

          {selectedMethod === 'ewallet' && (
            <div>
              <p className="text-xs text-slate-600 mb-3">Pilih aplikasi dompet digital favorit Anda:</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['GoPay', 'OVO', 'ShopeePay'].map(ew => (
                  <button
                    key={ew}
                    onClick={() => handleSimulatePayment(ew)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-cyan-600 hover:bg-cyan-50/50 text-center transition-all"
                  >
                    <span className="text-xs font-bold text-slate-800 block">{ew}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Instan</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Koneksi aman terenkripsi 256-bit SSL Payment Gateway</span>
          </div>
        </div>

      </div>
    </div>
  );
};
