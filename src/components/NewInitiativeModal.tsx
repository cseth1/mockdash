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
    objectives: [''],
    stakeholders: [''],
    budget: {
      allocated: 0,
      spent: 0,
      currency: 'USD'
    },
    timeline: {
      start: new Date().toISOString().split('T')[0],
      estimatedCompletion: '',
      phases: [
        { name: 'Planning', duration: 4, status: 'pending' as const }
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

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

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const addStakeholder = () => {
    setFormData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, '']
    }));
  };

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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initiative Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <input
                  type="text"
                  required
                  value={formData.owner}
                  onChange={e => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Initiative['status'] }))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objectives
              </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stakeholders
              </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={formData.budget.allocated}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      budget: { ...prev.budget, allocated: Number(e.target.value) }
                    }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Allocated budget..."
                  />
                </div>
                <div>
                  <select
                    value={formData.budget.currency}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      budget: { ...prev.budget, currency: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

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