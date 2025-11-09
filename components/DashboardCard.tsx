import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, style }) => {
  return (
    <div
      className="dashboard-component-card relative p-6 overflow-hidden animate-fade-in"
      style={style}
    >
      <div
        className="absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-10"
        style={{ backgroundColor: color, filter: 'blur(20px)' }}
      />
      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
        </div>
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;