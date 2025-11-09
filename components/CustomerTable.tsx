import React from 'react';
import { TopCustomer } from '../types';
import PremiumIcon from './icons/PremiumIcon';
import RegularIcon from './icons/RegularIcon';
import NormalIcon from './icons/NormalIcon';

type CustomerSegmentFilter = 'all' | 'premium' | 'regular' | 'normal';

interface CustomerTableProps {
  data: TopCustomer[];
  selectedCustomerIds: string[];
  onSelectionChange: (customerId: string) => void;
  onSelectAll: () => void;
  onBulkSendOffer: () => void;
  onOpenSingleOffer: (customer: TopCustomer) => void;
  activeFilter: CustomerSegmentFilter;
  onFilterChange: (filter: CustomerSegmentFilter) => void;
}

const segmentIcons = {
  premium: <PremiumIcon className="w-5 h-5 text-amber-400" />,
  regular: <RegularIcon className="w-5 h-5 text-sky-400" />,
  normal: <NormalIcon className="w-5 h-5 text-slate-400" />,
};

const filterOptions: { id: CustomerSegmentFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'premium', label: 'Premium' },
    { id: 'regular', label: 'Regular' },
    { id: 'normal', label: 'Normal' },
]

const CustomerTable: React.FC<CustomerTableProps> = ({ 
  data, 
  selectedCustomerIds,
  onSelectionChange,
  onSelectAll,
  onBulkSendOffer,
  onOpenSingleOffer,
  activeFilter,
  onFilterChange
}) => {
  const areAllSelected = data.length > 0 && selectedCustomerIds.length === data.length;

  return (
    <div className="dashboard-component-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-slate-100">Top Customers</h3>
        <div className="flex-1 flex justify-center items-center gap-2">
            {filterOptions.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => onFilterChange(id)}
                    className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${
                        activeFilter === id 
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(0,191,255,0.5)]' 
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
        <button
          onClick={onBulkSendOffer}
          disabled={selectedCustomerIds.length === 0}
          className="w-full sm:w-auto text-sm btn-gradient btn-gradient-login disabled:bg-slate-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          Send Offer ({selectedCustomerIds.length})
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-sm">
              <th className="py-3 px-4 w-12 text-center">
                <input 
                  type="checkbox"
                  checked={areAllSelected}
                  onChange={onSelectAll}
                  className="form-checkbox h-5 w-5 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium text-center">Segment</th>
              <th className="py-3 px-4 font-medium">Total Spending</th>
              <th className="py-3 px-4 font-medium text-center">Frequency</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer, index) => (
              <tr key={customer.id} className="border-b border-slate-800 hover:bg-slate-700/50 transition-colors" style={{ animation: `fade-in 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }}>
                <td className="py-4 px-4 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedCustomerIds.includes(customer.id)}
                    onChange={() => onSelectionChange(customer.id)}
                    className="form-checkbox h-5 w-5 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-100">{customer.name}</div>
                  <div className="text-xs text-slate-500">{customer.id}</div>
                </td>
                <td className="py-4 px-4">
                    <div className="flex justify-center items-center" title={customer.segment}>
                        {segmentIcons[customer.segment]}
                    </div>
                </td>
                <td className="py-4 px-4 text-slate-300 font-medium">${customer.totalSpending.toLocaleString()}</td>
                <td className="py-4 px-4 text-slate-300 text-center">{customer.frequency}</td>
                <td className="py-4 px-4 text-center">
                    <button
                        onClick={() => onOpenSingleOffer(customer)}
                        className="text-xs bg-slate-600/80 text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors hover:bg-slate-600"
                    >
                        Send Offer
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;