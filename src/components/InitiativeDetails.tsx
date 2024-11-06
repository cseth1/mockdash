import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, Calendar, Users, MessageSquare, DollarSign } from 'lucide-react';
import type { Initiative } from '../data/mockData';
import ObjectiveEditor from './ObjectiveEditor';
import TimelineEditor from './TimelineEditor';
import KPISection from './KPISection';
import ResourceSection from './ResourceSection';
import TimeTrackingSection from './TimeTrackingSection';
import DocumentationSection from './DocumentationSection';
import IntegrationGuide from './IntegrationGuide';

interface InitiativeDetailsProps {
  initiative: Initiative;
  onBack: () => void;
  onUpdate: (initiative: Initiative) => void;
  onAddUpdate: (initiativeId: number, message: string) => void;
  updates: Array<{
    id: number;
    initiative: string;
    message: string;
    timestamp: string;
    user: string;
    type: 'status' | 'comment' | 'milestone';
  }>;
}

const statusConfig = {
  'on-track': { icon: CheckCircle2, className: 'text-green-600 bg-green-50', label: 'On Track' },
  'at-risk': { icon: AlertCircle, className: 'text-yellow-600 bg-yellow-50', label: 'At Risk' },
  'delayed': { icon: Clock, className: 'text-red-600 bg-red-50', label: 'Delayed' },
};

const InitiativeDetails: React.FC<InitiativeDetailsProps> = ({ 
  initiative, 
  onBack, 
  onUpdate,
  onAddUpdate,
  updates 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInitiative, setUpdatedInitiative] = useState(initiative);
  const [newUpdate, setNewUpdate] = useState('');
  const StatusIcon = statusConfig[initiative.status].icon;
  const budgetProgress = (initiative.budget.spent / initiative.budget.allocated) * 100;

  const handleSave = () => {
    onUpdate(updatedInitiative);
    setIsEditing(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;
    
    onAddUpdate(initiative.id, newUpdate);
    setNewUpdate('');
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = Math.min(100, Math.max(0, Number(e.target.value)));
    setUpdatedInitiative(prev => ({
      ...prev,
      progress
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as Initiative['status'];
    setUpdatedInitiative(prev => ({
      ...prev,
      status
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#500000] text-white">
        <div className="container mx-auto px-4 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-white/60 mb-1">Project ID: {updatedInitiative.projectId}</div>
              <h1 className="text-2xl font-bold">{updatedInitiative.title}</h1>
              <p className="text-gray-300">{updatedInitiative.department}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                {isEditing ? 'Save Changes' : 'Edit Initiative'}
              </button>
              {isEditing ? (
                <select
                  value={updatedInitiative.status}
                  onChange={handleStatusChange}
                  className="px-4 py-2 rounded-lg text-gray-900"
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              ) : (
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statusConfig[updatedInitiative.status].className}`}>
                  <StatusIcon size={20} />
                  <span className="font-medium">{statusConfig[updatedInitiative.status].label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Initiative Overview</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-medium">{updatedInitiative.category}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-medium capitalize">{updatedInitiative.type}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Priority</div>
                    <div className="font-medium capitalize">{updatedInitiative.priority}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Stage</div>
                    <div className="font-medium capitalize">{updatedInitiative.stage}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                  {isEditing ? (
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={updatedInitiative.description}
                      onChange={e => setUpdatedInitiative(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600">{updatedInitiative.description}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Progress</h3>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={updatedInitiative.progress}
                      onChange={handleProgressChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 rounded-full h-3 transition-all"
                        style={{ width: `${updatedInitiative.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <ObjectiveEditor
                  objectives={updatedInitiative.objectives}
                  isEditing={isEditing}
                  onObjectiveChange={(objectives) => 
                    setUpdatedInitiative(prev => ({ ...prev, objectives }))
                  }
                />
              </div>
            </div>

            {/* KPIs Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Key Performance Indicators</h2>
              <KPISection
                kpis={updatedInitiative.kpis}
                isEditing={isEditing}
                onKPIsChange={(kpis) =>
                  setUpdatedInitiative(prev => ({ ...prev, kpis }))
                }
              />
            </div>

            {/* Resource Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Resource Requirements</h2>
              <ResourceSection
                resources={updatedInitiative.resourceRequirements}
                isEditing={isEditing}
                onResourcesChange={(resources) =>
                  setUpdatedInitiative(prev => ({ ...prev, resourceRequirements: resources }))
                }
              />
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Timeline</h2>
              <TimelineEditor
                phases={updatedInitiative.timeline.phases}
                isEditing={isEditing}
                onPhasesChange={(phases) =>
                  setUpdatedInitiative(prev => ({
                    ...prev,
                    timeline: { ...prev.timeline, phases }
                  }))
                }
              />
            </div>

            {/* Integration Guide */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Platform Integrations</h2>
              <IntegrationGuide
                integrations={updatedInitiative.integrations}
                isEditing={isEditing}
                onIntegrationsChange={(integrations) =>
                  setUpdatedInitiative(prev => ({ ...prev, integrations }))
                }
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Time Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Time Tracking</h2>
              <TimeTrackingSection
                timeTracking={updatedInitiative.timeTracking}
                isEditing={isEditing}
                onTimeTrackingChange={(timeTracking) =>
                  setUpdatedInitiative(prev => ({ ...prev, timeTracking }))
                }
              />
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Documentation</h2>
              <DocumentationSection
                documentation={updatedInitiative.documentation}
                isEditing={isEditing}
                onDocumentationChange={(documentation) =>
                  setUpdatedInitiative(prev => ({ ...prev, documentation }))
                }
              />
            </div>

            {/* Updates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Updates</h2>
              </div>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(update.user)}&background=500000&color=fff`}
                        alt={update.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{update.user}</p>
                        <p className="text-gray-600 text-sm">{update.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{update.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <form onSubmit={handleUpdateSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newUpdate}
                    onChange={e => setNewUpdate(e.target.value)}
                    placeholder="Add an update..."
                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <MessageSquare size={16} />
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InitiativeDetails;