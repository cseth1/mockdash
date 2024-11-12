import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import React from 'react';

interface TimelinePhaseProps {
  name: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'pending';
  isLast?: boolean;
}

const statusConfig = {
  completed: { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  'in-progress': { icon: Clock, className: 'text-blue-600 bg-blue-50' },
  pending: { icon: AlertCircle, className: 'text-gray-400 bg-gray-50' },
};

const TimelinePhase: React.FC<TimelinePhaseProps> = ({ name, duration, status, isLast }) => {
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig[status].className}`}>
          <StatusIcon size={16} />
        </div>
        {!isLast && <div className="w-0.5 h-16 bg-gray-200" />}
      </div>
      <div className="flex-grow pt-1">
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">{duration} weeks</p>
      </div>
    </div>
  );
};

export default TimelinePhase;