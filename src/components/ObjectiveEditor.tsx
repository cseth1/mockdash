import { ListChecks, PlusCircle, X } from 'lucide-react';
import React from 'react';

interface ObjectiveEditorProps {
  objectives: string[];
  isEditing: boolean;
  onObjectiveChange: (objectives: string[]) => void;
}

const ObjectiveEditor: React.FC<ObjectiveEditorProps> = ({
  objectives,
  isEditing,
  onObjectiveChange,
}) => {
  const handleAddObjective = () => {
    onObjectiveChange([...objectives, '']);
  };

  const handleRemoveObjective = (index: number) => {
    onObjectiveChange(objectives.filter((_, i) => i !== index));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    onObjectiveChange(newObjectives);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Objectives</h3>
        {isEditing && (
          <button
            onClick={handleAddObjective}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircle size={16} />
            Add Objective
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {objectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-2">
            <ListChecks className="text-blue-600 mt-1 flex-shrink-0" size={18} />
            {isEditing ? (
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder="Enter objective..."
                />
                <button
                  onClick={() => handleRemoveObjective(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <span className="text-gray-600">{objective}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectiveEditor;