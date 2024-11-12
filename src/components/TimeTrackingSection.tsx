import { Clock } from 'lucide-react';
import React from 'react';

interface TimeEntry {
  task: string;
  hours: number;
  date: string;
  user: string;
}

interface TimeTrackingSectionProps {
  timeTracking: TimeEntry[];
  isEditing: boolean;
  onTimeTrackingChange: (timeTracking: TimeEntry[]) => void;
}

const TimeTrackingSection: React.FC<TimeTrackingSectionProps> = ({
  timeTracking,
  isEditing,
  onTimeTrackingChange,
}) => {
  const handleAddTimeEntry = () => {
    onTimeTrackingChange([
      ...timeTracking,
      {
        task: '',
        hours: 0,
        date: new Date().toISOString().split('T')[0],
        user: ''
      }
    ]);
  };

  const handleTimeEntryChange = (index: number, field: keyof TimeEntry, value: string | number) => {
    const updatedEntries = [...timeTracking];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    onTimeTrackingChange(updatedEntries);
  };

  return (
    <div className="space-y-4">
      {timeTracking.map((entry, index) => (
        <div key={index} className="border rounded-lg p-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={entry.task}
                onChange={(e) => handleTimeEntryChange(index, 'task', e.target.value)}
                placeholder="Task description"
                className="w-full p-2 border rounded-lg"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  value={entry.hours}
                  onChange={(e) => handleTimeEntryChange(index, 'hours', Number(e.target.value))}
                  placeholder="Hours"
                  className="p-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => handleTimeEntryChange(index, 'date', e.target.value)}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={entry.user}
                  onChange={(e) => handleTimeEntryChange(index, 'user', e.target.value)}
                  placeholder="User"
                  className="p-2 border rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="text-green-600" size={20} />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{entry.task}</h4>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{entry.hours} hours</span>
                  <span>{entry.date}</span>
                  <span>{entry.user}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={handleAddTimeEntry}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          Add Time Entry
        </button>
      )}
    </div>
  );
};

export default TimeTrackingSection;