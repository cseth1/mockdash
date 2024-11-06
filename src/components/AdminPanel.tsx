import React, { useState, useMemo } from 'react';
import { X, BarChart3, ListTodo, Target, Users, Search, Filter, AlertTriangle } from 'lucide-react';
import MetricCard from './MetricCard';
import AdminTable from './AdminTable';
import { useInitiatives } from '../context/InitiativeContext';
import type { Initiative } from '../data/mockData';

interface AdminPanelProps {
  onClose: () => void;
  onInitiativeSelect: (id: number) => void;
}

type ViewType = 'all' | 'on-track' | 'in-progress' | 'teams';
type SortField = 'title' | 'progress' | 'status' | 'dueDate' | 'department';

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onInitiativeSelect }) => {
  const { state } = useInitiatives();
  const { initiatives, error } = state;

  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const departments = useMemo(() => 
    Array.from(new Set(initiatives.map(i => i.department))),
    [initiatives]
  );

  const metrics = useMemo(() => ({
    total: initiatives.length,
    onTrack: initiatives.filter(i => i.status === 'on-track').length,
    inProgress: initiatives.filter(i => i.progress > 0 && i.progress < 100).length,
    teams: departments.length,
  }), [initiatives, departments]);

  const getFilteredInitiatives = () => {
    let filtered = [...initiatives];

    // Apply view filter
    switch (currentView) {
      case 'on-track':
        filtered = filtered.filter(i => i.status === 'on-track');
        break;
      case 'in-progress':
        filtered = filtered.filter(i => i.progress > 0 && i.progress < 100);
        break;
      case 'teams':
        break;
    }

    // Apply department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(i => i.department === filterDepartment);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(term) ||
        i.department.toLowerCase().includes(term) ||
        i.owner.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'dueDate':
          comparison = a.dueDate.localeCompare(b.dueDate);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'all': return 'All Initiatives';
      case 'on-track': return 'On Track Projects';
      case 'in-progress': return 'In Progress Items';
      case 'teams': return 'Teams Overview';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-5xl h-full overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={<Target className="text-blue-600" />}
              title="Total Initiatives"
              value={metrics.total}
              trend={`${initiatives.length} active`}
              onClick={() => setCurrentView('all')}
              active={currentView === 'all'}
            />
            <MetricCard
              icon={<BarChart3 className="text-green-600" />}
              title="On Track"
              value={metrics.onTrack}
              trend="Projects in good standing"
              onClick={() => setCurrentView('on-track')}
              active={currentView === 'on-track'}
            />
            <MetricCard
              icon={<ListTodo className="text-yellow-600" />}
              title="In Progress"
              value={metrics.inProgress}
              trend="Ongoing initiatives"
              onClick={() => setCurrentView('in-progress')}
              active={currentView === 'in-progress'}
            />
            <MetricCard
              icon={<Users className="text-purple-600" />}
              title="Teams"
              value={metrics.teams}
              trend="Active departments"
              onClick={() => setCurrentView('teams')}
              active={currentView === 'teams'}
            />
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search initiatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">{getViewTitle()}</h3>
          <AdminTable
            initiatives={getFilteredInitiatives()}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            viewType={currentView}
            onInitiativeClick={onInitiativeSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;