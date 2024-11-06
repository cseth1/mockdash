import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface InitiativeCardProps {
  id: number;
  title: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: string;
  department: string;
  onClick: () => void;
}

const statusConfig = {
  'on-track': { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  'at-risk': { icon: AlertCircle, className: 'text-yellow-600 bg-yellow-50' },
  'delayed': { icon: Clock, className: 'text-red-600 bg-red-50' },
};

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  owner,
  progress,
  status,
  dueDate,
  department,
  onClick,
}) => {
  const StatusIcon = statusConfig[status].icon;

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{department}</p>
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
            className="bg-blue-600 rounded-full h-2 transition-all"
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
  );
}

export default InitiativeCard;