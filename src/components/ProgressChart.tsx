import React from 'react';

import type { Initiative } from '../data/mockData';

interface ProgressChartProps {
  initiatives?: Initiative[]; // Mark initiatives as optional
}

const ProgressChart: React.FC<ProgressChartProps> = ({ initiatives = [] }) => { // Default to empty array
  const getStatusPercentages = () => {
    const total = initiatives.length;
    if (total === 0) return []; // If there are no initiatives, return an empty array

    const statusCounts = initiatives.reduce((acc, initiative) => {
      acc[initiative.status] = (acc[initiative.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { 
        label: 'Completed', 
        percentage: Math.round((statusCounts['completed'] || 0) / total * 100),
        color: 'bg-emerald-500' 
      },
      { 
        label: 'In Progress', 
        percentage: Math.round((initiatives.filter(i => 
          i.progress > 0 && 
          i.progress < 100 && 
          i.status === 'on-track' &&
          !['completed', 'canceled'].includes(i.status)
        ).length / total) * 100),
        color: 'bg-blue-500' 
      },
      { 
        label: 'At Risk', 
        percentage: Math.round((statusCounts['at-risk'] || 0) / total * 100),
        color: 'bg-yellow-500' 
      },
      { 
        label: 'Delayed', 
        percentage: Math.round((statusCounts['delayed'] || 0) / total * 100),
        color: 'bg-red-500' 
      },
      { 
        label: 'Canceled', 
        percentage: Math.round((statusCounts['canceled'] || 0) / total * 100),
        color: 'bg-gray-500' 
      },
    ];
  };

  const data = getStatusPercentages();

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
};

export default ProgressChart;
