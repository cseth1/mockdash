import { Clock, MessageSquare } from 'lucide-react';
import React from 'react';

interface Update {
  id: number;
  initiative: string;
  message: string;
  timestamp: string;
  user: string;
  type: 'status' | 'comment' | 'milestone';
}

interface RecentUpdatesProps {
  updates: Update[];
}

const RecentUpdates: React.FC<RecentUpdatesProps> = ({ updates }) => {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="flex gap-4 p-4 border rounded-lg">
          <div className="flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(update.user)}&background=500000&color=fff`}
              alt={update.user}
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-grow">
            <h4 className="font-medium">{update.initiative}</h4>
            <p className="text-gray-600 mt-1">{update.message}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {update.timestamp}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} />
                {update.user}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentUpdates;