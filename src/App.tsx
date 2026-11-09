/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ISPProvider, useISP } from './context/ISPContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/auth/AdminLogin';
import { CustomerPortal } from './components/portal/CustomerPortal';
import { CustomerLogin } from './components/auth/CustomerLogin';

const MainApp: React.FC = () => {
  const { currentAdmin, currentCustomer } = useISP();
  
  // Track current mode: 'admin' or 'customer'
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');

  if (viewMode === 'admin') {
    if (!currentAdmin) {
      return <AdminLogin onSwitchToCustomer={() => setViewMode('customer')} />;
    }
    return <AdminLayout onSwitchToCustomerPortal={() => setViewMode('customer')} />;
  }

  // Customer View
  if (!currentCustomer) {
    return <CustomerLogin onSwitchToAdmin={() => setViewMode('admin')} />;
  }

  return (
    <div className="relative">
      {/* Small floating switcher button to jump back to admin easily */}
      <div className="no-print fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setViewMode('admin')}
          className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-full shadow-lg border border-slate-700 backdrop-blur-xs flex items-center gap-1.5 transition-all opacity-85 hover:opacity-100"
        >
          <span>Akses Panel Admin ISP →</span>
        </button>
      </div>
      <CustomerPortal />
    </div>
  );
};

export default function App() {
  return (
    <ISPProvider>
      <MainApp />
    </ISPProvider>
  );
}
