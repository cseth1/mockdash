import React from 'react';
import { PlusCircle, X } from 'lucide-react';
import TimelinePhase from './TimelinePhase';

interface Phase {
  name: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface TimelineEditorProps {
  phases: Phase[];
  isEditing: boolean;
  onPhasesChange: (phases: Phase[]) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  phases,
  isEditing,
  onPhasesChange,
}) => {
  const handleAddPhase = () => {
    onPhasesChange([
      ...phases,
      { name: '', duration: 4, status: 'pending' },
    ]);
  };

  const handleRemovePhase = (index: number) => {
    onPhasesChange(phases.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index: number, field: keyof Phase, value: string | number) => {
    const newPhases = [...phases];
    newPhases[index] = { 
      ...newPhases[index],
      [field]: field === 'duration' ? Number(value) : value
    };
    onPhasesChange(newPhases);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Timeline Phases</h3>
        {isEditing && (
          <button
            onClick={handleAddPhase}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircle size={16} />
            Add Phase
          </button>
        )}
      </div>
      <div className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                  placeholder="Phase name"
                  className="flex-grow p-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={phase.duration}
                  onChange={(e) => handlePhaseChange(index, 'duration', e.target.value)}
                  min="1"
                  className="w-24 p-2 border rounded-lg"
                />
                <select
                  value={phase.status}
                  onChange={(e) => handlePhaseChange(index, 'status', e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={() => handleRemovePhase(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <TimelinePhase
                key={index}
                {...phase}
                isLast={index === phases.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;