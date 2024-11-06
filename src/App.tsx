import React, { useState } from 'react';
import { BarChart3, ListTodo, PlusCircle, RefreshCw, Target, Users, Settings } from 'lucide-react';
import InitiativeCard from './components/InitiativeCard';
import ProgressChart from './components/ProgressChart';
import MetricCard from './components/MetricCard';
import RecentUpdates from './components/RecentUpdates';
import AdminPanel from './components/AdminPanel';
import InitiativeDetails from './components/InitiativeDetails';
import NewInitiativeModal from './components/NewInitiativeModal';
import { initiatives as initialInitiatives, metrics, updates as initialUpdates } from './data/mockData';
import type { Initiative } from './data/mockData';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showNewInitiative, setShowNewInitiative] = useState(false);
  const [isAdmin] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState<number | null>(null);
  const [initiatives, setInitiatives] = useState(initialInitiatives);
  const [updates, setUpdates] = useState(initialUpdates);

  const handleInitiativeClick = (id: number) => {
    setSelectedInitiative(id);
  };

  const handleBackClick = () => {
    setSelectedInitiative(null);
  };

  const handleNewInitiative = (initiativeData: Omit<Initiative, 'id'>) => {
    const newInitiative = {
      ...initiativeData,
      id: Math.max(...initiatives.map(i => i.id)) + 1
    };
    setInitiatives(prev => [...prev, newInitiative]);
    
    const newUpdate = {
      id: Math.max(...updates.map(u => u.id)) + 1,
      initiative: initiativeData.title,
      message: 'New initiative created',
      timestamp: 'Just now',
      user: initiativeData.owner,
      type: 'status' as const
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  const handleInitiativeUpdate = (updatedInitiative: Initiative) => {
    setInitiatives(prev =>
      prev.map(i => i.id === updatedInitiative.id ? updatedInitiative : i)
    );
  };

  const handleAddUpdate = (initiativeId: number, message: string) => {
    const initiative = initiatives.find(i => i.id === initiativeId);
    if (!initiative) return;

    const newUpdate = {
      id: Math.max(...updates.map(u => u.id)) + 1,
      initiative: initiative.title,
      message,
      timestamp: 'Just now',
      user: initiative.owner,
      type: 'status' as const
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  if (selectedInitiative !== null) {
    const initiative = initiatives.find(i => i.id === selectedInitiative);
    if (initiative) {
      return (
        <InitiativeDetails
          initiative={initiative}
          onBack={handleBackClick}
          onUpdate={handleInitiativeUpdate}
          onAddUpdate={handleAddUpdate}
          updates={updates.filter(u => u.initiative === initiative.title)}
        />
      );
    }
  }

  const getStatusCounts = () => {
    return initiatives.reduce((acc, initiative) => {
      acc[initiative.status] = (acc[initiative.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#500000] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Strategic Initiatives Dashboard</h1>
              <p className="text-gray-300">Texas A&M Human Resources</p>
            </div>
            <div className="flex gap-4">
              {isAdmin && (
                <button 
                  onClick={() => setShowAdmin(!showAdmin)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                  <Settings size={20} />
                  Admin Panel
                </button>
              )}
              <button 
                onClick={() => setShowNewInitiative(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                <PlusCircle size={20} />
                New Initiative
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                <RefreshCw size={20} />
                Update Status
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          initiatives={initiatives}
          metrics={metrics}
        />
      )}
      {showNewInitiative && (
        <NewInitiativeModal
          onClose={() => setShowNewInitiative(false)}
          onSubmit={handleNewInitiative}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Target className="text-blue-600" />}
            title="Total Initiatives"
            value={initiatives.length}
            trend={`${initiatives.filter(i => i.status === 'on-track').length} on track`}
          />
          <MetricCard
            icon={<BarChart3 className="text-green-600" />}
            title="On Track"
            value={statusCounts['on-track'] || 0}
            trend="Projects in good standing"
          />
          <MetricCard
            icon={<ListTodo className="text-yellow-600" />}
            title="At Risk"
            value={statusCounts['at-risk'] || 0}
            trend="Need attention"
          />
          <MetricCard
            icon={<Users className="text-purple-600" />}
            title="Delayed"
            value={statusCounts['delayed'] || 0}
            trend="Requires intervention"
          />
        </div>

        {/* Progress Overview and Active Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Overall Progress</h2>
              <ProgressChart />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Department Overview</h2>
              <div className="space-y-4">
                {Array.from(new Set(initiatives.map(i => i.department))).map(dept => {
                  const deptInitiatives = initiatives.filter(i => i.department === dept);
                  const onTrack = deptInitiatives.filter(i => i.status === 'on-track').length;
                  return (
                    <div key={dept} className="flex items-center justify-between">
                      <span className="font-medium">{dept}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{deptInitiatives.length} initiatives</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 rounded-full h-2"
                            style={{ width: `${(onTrack / deptInitiatives.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Active Initiatives</h2>
                <div className="flex gap-2">
                  <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>All Departments</option>
                    {Array.from(new Set(initiatives.map(i => i.department))).map(dept => (
                      <option key={dept}>{dept}</option>
                    ))}
                  </select>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>On Track</option>
                    <option>At Risk</option>
                    <option>Delayed</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                {initiatives.map((initiative) => (
                  <InitiativeCard 
                    key={initiative.id} 
                    {...initiative} 
                    onClick={() => handleInitiativeClick(initiative.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Updates</h2>
          <RecentUpdates updates={updates} />
        </div>
      </main>
    </div>
  );
}

export default App;