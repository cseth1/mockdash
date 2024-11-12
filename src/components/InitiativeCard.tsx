import { AlertCircle, CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';
import React from 'react';

interface InitiativeCardProps {
  id: number;
  title: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed' | 'canceled';
  dueDate: string;
  department: string;
  archived?: boolean;
  completedDate?: string;
  onClick: () => void;
  onRestore?: () => void;
}

const statusConfig = {
  'on-track': { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  'at-risk': { icon: AlertCircle, className: 'text-yellow-600 bg-yellow-50' },
  'delayed': { icon: Clock, className: 'text-red-600 bg-red-50' },
  'completed': { icon: CheckCircle2, className: 'text-emerald-600 bg-emerald-50' },
  'canceled': { icon: XCircle, className: 'text-gray-600 bg-gray-50' },
};

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  owner,
  progress,
  status,
  dueDate,
  department,
  archived,
  completedDate,
  onClick,
  onRestore,
}) => {
  const StatusIcon = statusConfig[status].icon;
  const isTerminalStatus = ['completed', 'canceled'].includes(status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div 
        className="cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-gray-600 text-sm">{department}</p>
            {completedDate && (
              <p className="text-sm text-gray-500 mt-1">
                {status === 'completed' ? 'Completed' : 'Canceled'} on{' '}
                {new Date(completedDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${statusConfig[status].className}`}>
            <StatusIcon size={20} />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 transition-all ${
                status === 'completed' ? 'bg-emerald-600' :
                status === 'canceled' ? 'bg-gray-600' :
                'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(owner)}&background=500000&color=fff`}
              alt={owner}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-600">{owner}</span>
          </div>
          <span className="text-gray-500">Due {dueDate}</span>
        </div>
      </div>

      {archived && onRestore && !isTerminalStatus && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onRestore}
            className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 py-2"
          >
            <RotateCcw size={16} />
            Restore Initiative
          </button>
        </div>
      )}
    </div>
  );
}

export default InitiativeCard;