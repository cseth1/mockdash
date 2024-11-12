import { AlertCircle, ArrowUpDown, CheckCircle2, Clock } from 'lucide-react';
import React from 'react';

import type { Initiative } from '../data/mockData';

interface AdminTableProps {
  initiatives: Initiative[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: any) => void;
  viewType: 'all' | 'on-track' | 'in-progress' | 'teams';
  onInitiativeClick: (id: number) => void;
}

const statusConfig = {
  'on-track': { icon: CheckCircle2, className: 'text-green-600' },
  'at-risk': { icon: AlertCircle, className: 'text-yellow-600' },
  'delayed': { icon: Clock, className: 'text-red-600' },
};

const AdminTable: React.FC<AdminTableProps> = ({
  initiatives,
  sortField,
  sortDirection,
  onSort,
  viewType,
  onInitiativeClick,
}) => {
  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 hover:text-blue-600 ${
        sortField === field ? 'text-blue-600' : ''
      }`}
    >
      {children}
      <ArrowUpDown size={14} className={`transition-transform ${
        sortField === field && sortDirection === 'desc' ? 'rotate-180' : ''
      }`} />
    </button>
  );

  if (viewType === 'teams') {
    const teamData = initiatives.reduce((acc, initiative) => {
      const dept = initiative.department;
      if (!acc[dept]) {
        acc[dept] = {
          total: 0,
          onTrack: 0,
          atRisk: 0,
          delayed: 0,
          initiatives: []
        };
      }
      acc[dept].total++;
      acc[dept].initiatives.push(initiative);
      switch (initiative.status) {
        case 'on-track': acc[dept].onTrack++; break;
        case 'at-risk': acc[dept].atRisk++; break;
        case 'delayed': acc[dept].delayed++; break;
      }
      return acc;
    }, {} as Record<string, { total: number; onTrack: number; atRisk: number; delayed: number; initiatives: Initiative[] }>);

    return (
      <div className="space-y-6">
        {Object.entries(teamData).map(([department, data]) => (
          <div key={department} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">{department}</h4>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">{data.onTrack} On Track</span>
                <span className="text-yellow-600">{data.atRisk} At Risk</span>
                <span className="text-red-600">{data.delayed} Delayed</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.initiatives.map(initiative => (
                <div 
                  key={initiative.id} 
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onInitiativeClick(initiative.id)}
                >
                  <h5 className="font-medium mb-1">{initiative.title}</h5>
                  <p className="text-sm text-gray-600">Owner: {initiative.owner}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {React.createElement(statusConfig[initiative.status].icon, {
                      size: 16,
                      className: statusConfig[initiative.status].className
                    })}
                    <span className="text-sm">{initiative.progress}% Complete</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <SortButton field="title">Initiative</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="department">Department</SortButton>
            </th>
            <th className="px-4 py-3 text-left">Owner</th>
            <th className="px-4 py-3 text-left">
              <SortButton field="progress">Progress</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="status">Status</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="dueDate">Due Date</SortButton>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {initiatives.map(initiative => {
            const StatusIcon = statusConfig[initiative.status].icon;
            return (
              <tr 
                key={initiative.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onInitiativeClick(initiative.id)}
              >
                <td className="px-4 py-3">{initiative.title}</td>
                <td className="px-4 py-3">{initiative.department}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(initiative.owner)}&background=500000&color=fff`}
                      alt={initiative.owner}
                      className="w-6 h-6 rounded-full"
                    />
                    {initiative.owner}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${initiative.progress}%` }}
                      />
                    </div>
                    <span>{initiative.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <StatusIcon className={statusConfig[initiative.status].className} size={16} />
                    <span className="capitalize">{initiative.status.replace('-', ' ')}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{initiative.dueDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;