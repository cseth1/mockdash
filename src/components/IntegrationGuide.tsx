import { Puzzle } from 'lucide-react';
import React from 'react';

interface Integration {
  platform: string;
  requirements: string[];
  status: 'connected' | 'pending' | 'failed';
}

interface IntegrationGuideProps {
  integrations: Integration[];
  isEditing: boolean;
  onIntegrationsChange: (integrations: Integration[]) => void;
}

const IntegrationGuide: React.FC<IntegrationGuideProps> = ({
  integrations,
  isEditing,
  onIntegrationsChange,
}) => {
  const handleAddIntegration = () => {
    onIntegrationsChange([
      ...integrations,
      { platform: '', requirements: [], status: 'pending' }
    ]);
  };

  const handleIntegrationChange = (index: number, field: keyof Integration, value: any) => {
    const updatedIntegrations = [...integrations];
    updatedIntegrations[index] = {
      ...updatedIntegrations[index],
      [field]: value
    };
    onIntegrationsChange(updatedIntegrations);
  };

  return (
    <div className="space-y-4">
      {integrations.map((integration, index) => (
        <div key={index} className="border rounded-lg p-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={integration.platform}
                onChange={(e) => handleIntegrationChange(index, 'platform', e.target.value)}
                placeholder="Platform name"
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                value={integration.requirements.join('\n')}
                onChange={(e) => handleIntegrationChange(index, 'requirements', e.target.value.split('\n'))}
                placeholder="Requirements (one per line)"
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
              <select
                value={integration.status}
                onChange={(e) => handleIntegrationChange(index, 'status', e.target.value as Integration['status'])}
                className="w-full p-2 border rounded-lg"
              >
                <option value="connected">Connected</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Puzzle className="text-indigo-600" size={20} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{integration.platform}</h4>
                  <div className={`text-sm ${
                    integration.status === 'connected' ? 'text-green-600' :
                    integration.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {integration.status}
                  </div>
                </div>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
                {integration.requirements.map((req, reqIndex) => (
                  <li key={reqIndex}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={handleAddIntegration}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          Add Integration
        </button>
      )}
    </div>
  );
};

export default IntegrationGuide;