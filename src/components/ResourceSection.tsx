import { Clock, DollarSign, Users } from 'lucide-react';
import React from 'react';

interface Resource {
  type: 'human' | 'financial' | 'time';
  description: string;
  allocation: string;
  status: 'allocated' | 'pending' | 'at-risk';
}

interface ResourceSectionProps {
  resources: Resource[];
  isEditing: boolean;
  onResourcesChange: (resources: Resource[]) => void;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({ resources, isEditing, onResourcesChange }) => {
  const handleAddResource = () => {
    onResourcesChange([
      ...resources,
      { type: 'human', description: '', allocation: '', status: 'pending' }
    ]);
  };

  const handleResourceChange = (index: number, field: keyof Resource, value: string) => {
    const updatedResources = [...resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value
    };
    onResourcesChange(updatedResources);
  };

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'human': return Users;
      case 'financial': return DollarSign;
      case 'time': return Clock;
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource, index) => {
        const Icon = getIcon(resource.type);
        return (
          <div key={index} className="border rounded-lg p-4">
            {isEditing ? (
              <div className="space-y-3">
                <select
                  value={resource.type}
                  onChange={(e) => handleResourceChange(index, 'type', e.target.value as Resource['type'])}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="human">Human Resource</option>
                  <option value="financial">Financial Resource</option>
                  <option value="time">Time Resource</option>
                </select>
                <input
                  type="text"
                  value={resource.description}
                  onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                  placeholder="Resource description"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={resource.allocation}
                  onChange={(e) => handleResourceChange(index, 'allocation', e.target.value)}
                  placeholder="Resource allocation"
                  className="w-full p-2 border rounded-lg"
                />
                <select
                  value={resource.status}
                  onChange={(e) => handleResourceChange(index, 'status', e.target.value as Resource['status'])}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="allocated">Allocated</option>
                  <option value="pending">Pending</option>
                  <option value="at-risk">At Risk</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Icon className="text-purple-600" size={20} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{resource.description}</h4>
                  <p className="text-sm text-gray-600">{resource.allocation}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  resource.status === 'allocated' ? 'bg-green-100 text-green-700' :
                  resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {resource.status}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {isEditing && (
        <button
          onClick={handleAddResource}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          Add Resource
        </button>
      )}
    </div>
  );
};

export default ResourceSection;