import React, { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  trend: string;
  onClick?: () => void;
  active?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, 
  title, 
  value, 
  trend,
  onClick,
  active = false
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${active ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-600 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-gray-500 text-sm">{trend}</p>
        </div>
      </div>
    </div>
  );
}

export default MetricCard;