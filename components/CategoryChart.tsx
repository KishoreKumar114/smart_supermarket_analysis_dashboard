import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TopCategory } from '../types';

interface CategoryChartProps {
  data: TopCategory[];
}

const COLORS = ['#00BFFF', '#FF007F', '#FF1E56', '#a855f7', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-700">
          <p className="font-bold text-slate-200">{label}</p>
          <p style={{ color: payload[0].fill }}>{`Sales: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <div className="dashboard-component-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Selling Categories</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
            <Tooltip cursor={{fill: 'rgba(0, 191, 255, 0.1)'}} content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;