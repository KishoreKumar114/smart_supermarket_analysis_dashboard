import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DashboardData, TopCustomer } from './types';
import { analyzeSalesData } from './services/geminiService';
import DashboardCard from './components/DashboardCard';
import SalesChart from './components/SalesChart';
import CategoryChart from './components/CategoryChart';
import CustomerTable from './components/CustomerTable';
import FileUpload from './components/FileUpload';
import PremiumIcon from './components/icons/PremiumIcon';
import RegularIcon from './components/icons/RegularIcon';
import NormalIcon from './components/icons/NormalIcon';
import OfferModal from './components/OfferModal';
import Toast from './components/Toast';
import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState(true);
  const [selectedCustomersToSend, setSelectedCustomersToSend] = useState<TopCustomer[] | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState<'all' | 'premium' | 'regular' | 'normal'>('all');

  const filteredTopCustomers = useMemo(() => {
    if (!dashboardData) return [];
    if (customerSegmentFilter === 'all') return dashboardData.topCustomers;
    return dashboardData.topCustomers.filter(c => c.segment === customerSegmentFilter);
  }, [dashboardData, customerSegmentFilter]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const fileContent = await file.text();
      const data = await analyzeSalesData(fileContent);
      setDashboardData(data);
      setIsInitialState(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsInitialState(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleReset = () => {
    setDashboardData(null);
    setError(null);
    setIsInitialState(true);
    setCustomerSegmentFilter('all');
    setIsAuthenticated(false); // Log out
  };
  
  // Selection handlers for CustomerTable
  const handleSelectionChange = useCallback((customerId: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
      if (selectedCustomerIds.length === filteredTopCustomers.length) {
        setSelectedCustomerIds([]);
      } else {
        setSelectedCustomerIds(filteredTopCustomers.map(c => c.id));
      }
  }, [filteredTopCustomers, selectedCustomerIds.length]);
  
  const handleOpenBulkOfferModal = () => {
    if (dashboardData) {
        const customers = dashboardData.topCustomers.filter(c => selectedCustomerIds.includes(c.id));
        if (customers.length > 0) {
            setSelectedCustomersToSend(customers);
        }
    }
  };

  const handleOpenSingleOfferModal = (customer: TopCustomer) => {
    setSelectedCustomersToSend([customer]);
  };
  
  const handleCloseOfferModal = () => {
    setSelectedCustomersToSend(null);
  };

  const handleSendOffer = (message: string, platform: 'sms' | 'whatsapp', mobileNumber?: string) => {
    const count = selectedCustomersToSend?.length || 0;
    const recipient = count === 1 && mobileNumber ? `customer at ${mobileNumber}` : `${count} customer(s)`;
    console.log(`Sending offer to ${recipient} via ${platform.toUpperCase()}: ${message}`);
    setToastMessage(`Offer sent to ${recipient} via ${platform.toUpperCase()}!`);
    handleCloseOfferModal();
    setSelectedCustomerIds([]); // Clear selection after sending
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Reset selection when data or filter changes
  useEffect(() => {
    setSelectedCustomerIds([]);
  }, [dashboardData, customerSegmentFilter]);

  // Manage body class for backgrounds
  useEffect(() => {
    if (isAuthenticated && !isInitialState) {
      document.body.className = 'text-slate-200';
    }
  }, [isAuthenticated, isInitialState]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (isInitialState) {
    return <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} onLogout={handleReset} />;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
          <p>Something went wrong. Please try uploading again.</p>
      </div>
    )
  }

  const { customerSegmentation, dailySales, topCategories } = dashboardData;

  return (
    <div className="min-h-screen">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {selectedCustomersToSend && (
        <OfferModal 
          customers={selectedCustomersToSend}
          onClose={handleCloseOfferModal}
          onSend={handleSendOffer}
        />
      )}
      <header className="header-glow sticky top-0 z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-100">Analytics Dashboard</h1>
            <button
              onClick={handleReset}
              className="bg-slate-700 text-slate-200 hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Logout & Analyze New Data
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DashboardCard
            title="Premium Customers"
            value={customerSegmentation.premium.toLocaleString()}
            icon={<PremiumIcon className="w-7 h-7 text-amber-400" />}
            color="#f59e0b"
          />
          <DashboardCard
            title="Regular Customers"
            value={customerSegmentation.regular.toLocaleString()}
            icon={<RegularIcon className="w-7 h-7 text-sky-400" />}
            color="#00BFFF"
          />
          <DashboardCard
            title="Normal Customers"
            value={customerSegmentation.normal.toLocaleString()}
            icon={<NormalIcon className="w-7 h-7 text-slate-400" />}
            color="#64748b"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SalesChart data={dailySales} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart data={topCategories} />
          </div>
        </div>

        <div>
          <CustomerTable 
            data={filteredTopCustomers} 
            selectedCustomerIds={selectedCustomerIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            onBulkSendOffer={handleOpenBulkOfferModal}
            onOpenSingleOffer={handleOpenSingleOfferModal}
            activeFilter={customerSegmentFilter}
            onFilterChange={setCustomerSegmentFilter}
          />
        </div>
      </main>
    </div>
  );
};

export default App;