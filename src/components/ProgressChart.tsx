import React from 'react';

const ProgressChart: React.FC = () => {
  const data = [
    { label: 'Completed', percentage: 35, color: 'bg-green-500' },
    { label: 'In Progress', percentage: 45, color: 'bg-blue-500' },
    { label: 'At Risk', percentage: 15, color: 'bg-yellow-500' },
    { label: 'Delayed', percentage: 5, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {data.map(({ label, percentage, color }) => (
        <div key={label}>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{label}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${color} rounded-full h-2 transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProgressChart;