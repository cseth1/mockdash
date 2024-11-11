import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Initiative } from '../data/mockData';

interface NewInitiativeModalProps {
  onClose: () => void;
  onSubmit: (initiative: Omit<Initiative, 'id'>) => void;
}

const NewInitiativeModal: React.FC<NewInitiativeModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    owner: '',
    status: 'on-track' as Initiative['status'],
    dueDate: '',
    progress: 0,
    category: '',
    priority: 'medium' as Initiative['priority'],
    type: 'strategic' as Initiative['type'],
    stage: 'kickoff' as Initiative['stage'],
    objectives: [''],
    stakeholders: [''],
    kpis: [{ metric: '', target: '' }],
    resourceRequirements: [{ type: '', description: '' }],
    timeTracking: [{ task: '', hours: 0 }],
    documentation: [{ title: '', url: '' }],
    integrations: [{ platform: '', requirements: [''] }],
    budget: {
      allocated: 0,
      spent: 0,
      currency: 'USD'
    },
    timeline: {
      start: new Date().toISOString().split('T')[0],
      estimatedCompletion: '',
      phases: [{ name: 'Planning', duration: 4, status: 'pending' as const }]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // Helper functions for dynamic fields
  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const handleStakeholderChange = (index: number, value: string) => {
    const newStakeholders = [...formData.stakeholders];
    newStakeholders[index] = value;
    setFormData(prev => ({ ...prev, stakeholders: newStakeholders }));
  };

  const addObjective = () => setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  const addStakeholder = () => setFormData(prev => ({ ...prev, stakeholders: [...prev.stakeholders, ''] }));

  const handleKPIChange = (index: number, field: string, value: string) => {
    const newKPIs = [...formData.kpis];
    newKPIs[index] = { ...newKPIs[index], [field]: value };
    setFormData(prev => ({ ...prev, kpis: newKPIs }));
  };

  const addKPI = () => setFormData(prev => ({ ...prev, kpis: [...prev.kpis, { metric: '', target: '' }] }));

  const handleResourceChange = (index: number, field: string, value: string) => {
    const newResources = [...formData.resourceRequirements];
    newResources[index] = { ...newResources[index], [field]: value };
    setFormData(prev => ({ ...prev, resourceRequirements: newResources }));
  };

  const addResource = () => setFormData(prev => ({ ...prev, resourceRequirements: [...prev.resourceRequirements, { type: '', description: '' }] }));

  const handleTimeTrackingChange = (index: number, field: string, value: any) => {
    const newTimeTracking = [...formData.timeTracking];
    newTimeTracking[index] = { ...newTimeTracking[index], [field]: value };
    setFormData(prev => ({ ...prev, timeTracking: newTimeTracking }));
  };

  const addTimeTracking = () => setFormData(prev => ({ ...prev, timeTracking: [...prev.timeTracking, { task: '', hours: 0 }] }));

  const handleDocumentationChange = (index: number, field: string, value: string) => {
    const newDocumentation = [...formData.documentation];
    newDocumentation[index] = { ...newDocumentation[index], [field]: value };
    setFormData(prev => ({ ...prev, documentation: newDocumentation }));
  };

  const addDocumentation = () => setFormData(prev => ({ ...prev, documentation: [...prev.documentation, { title: '', url: '' }] }));

  const handleIntegrationChange = (index: number, field: string, value: string | string[]) => {
    const newIntegrations = [...formData.integrations];
    newIntegrations[index] = { ...newIntegrations[index], [field]: value };
    setFormData(prev => ({ ...prev, integrations: newIntegrations }));
  };

  const addIntegration = () => setFormData(prev => ({ ...prev, integrations: [...prev.integrations, { platform: '', requirements: [''] }] }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Initiative</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title, Description, Department, and Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initiative Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* KPIs Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">KPIs</label>
            <div className="space-y-2">
              {formData.kpis.map((kpi, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Metric"
                    value={kpi.metric}
                    onChange={e => handleKPIChange(index, 'metric', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Target"
                    value={kpi.target}
                    onChange={e => handleKPIChange(index, 'target', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {index === formData.kpis.length - 1 && (
                    <button
                      type="button"
                      onClick={addKPI}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add KPI
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Objectives Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
            <div className="space-y-2">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={e => handleObjectiveChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter objective..."
                  />
                  {index === formData.objectives.length - 1 && (
                    <button
                      type="button"
                      onClick={addObjective}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stakeholders</label>
            <div className="space-y-2">
              {formData.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={stakeholder}
                    onChange={e => handleStakeholderChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter stakeholder..."
                  />
                  {index === formData.stakeholders.length - 1 && (
                    <button
                      type="button"
                      onClick={addStakeholder}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Tracking Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Tracking</label>
            <div className="space-y-2">
              {formData.timeTracking.map((entry, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Task"
                    value={entry.task}
                    onChange={e => handleTimeTrackingChange(index, 'task', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Hours"
                    value={entry.hours}
                    onChange={e => handleTimeTrackingChange(index, 'hours', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {index === formData.timeTracking.length - 1 && (
                    <button
                      type="button"
                      onClick={addTimeTracking}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add Entry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documentation</label>
            <div className="space-y-2">
              {formData.documentation.map((doc, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={doc.title}
                    onChange={e => handleDocumentationChange(index, 'title', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={doc.url}
                    onChange={e => handleDocumentationChange(index, 'url', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {index === formData.documentation.length - 1 && (
                    <button
                      type="button"
                      onClick={addDocumentation}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add Document
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integrations Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Integrations</label>
            <div className="space-y-2">
              {formData.integrations.map((integration, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Platform"
                    value={integration.platform}
                    onChange={e => handleIntegrationChange(index, 'platform', e.target.value)}
                    className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {index === formData.integrations.length - 1 && (
                    <button
                      type="button"
                      onClick={addIntegration}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add Integration
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Initiative
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInitiativeModal;

