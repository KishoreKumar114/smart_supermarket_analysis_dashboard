import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DailySale } from '../types';

interface SalesChartProps {
  data: DailySale[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-700">
        <p className="font-bold text-slate-200">{label}</p>
        <p className="text-blue-400">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
        <p className="text-indigo-400">{`Purchases: $${payload[1].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="dashboard-component-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Daily Sales & Purchases</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00BFFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF007F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF007F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Area type="monotone" dataKey="sales" stroke="#00BFFF" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
            <Area type="monotone" dataKey="purchases" stroke="#FF007F" fillOpacity={1} fill="url(#colorPurchases)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;