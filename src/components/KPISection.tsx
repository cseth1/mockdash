import { Target } from 'lucide-react';
import React from 'react';

interface KPI {
  metric: string;
  target: string;
  current: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

interface KPISectionProps {
  kpis: KPI[];
  isEditing: boolean;
  onKPIsChange: (kpis: KPI[]) => void;
}

const KPISection: React.FC<KPISectionProps> = ({ kpis, isEditing, onKPIsChange }) => {
  const handleAddKPI = () => {
    onKPIsChange([
      ...kpis,
      { metric: '', target: '', current: '', status: 'on-track' }
    ]);
  };

  const handleKPIChange = (index: number, field: keyof KPI, value: string) => {
    const updatedKPIs = [...kpis];
    updatedKPIs[index] = {
      ...updatedKPIs[index],
      [field]: value
    };
    onKPIsChange(updatedKPIs);
  };

  return (
    <div className="space-y-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="border rounded-lg p-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={kpi.metric}
                onChange={(e) => handleKPIChange(index, 'metric', e.target.value)}
                placeholder="Metric name"
                className="w-full p-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={kpi.target}
                  onChange={(e) => handleKPIChange(index, 'target', e.target.value)}
                  placeholder="Target value"
                  className="p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={kpi.current}
                  onChange={(e) => handleKPIChange(index, 'current', e.target.value)}
                  placeholder="Current value"
                  className="p-2 border rounded-lg"
                />
              </div>
              <select
                value={kpi.status}
                onChange={(e) => handleKPIChange(index, 'status', e.target.value as KPI['status'])}
                className="w-full p-2 border rounded-lg"
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="behind">Behind</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="text-blue-600" size={20} />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{kpi.metric}</h4>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Target: {kpi.target}</span>
                  <span>Current: {kpi.current}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                kpi.status === 'on-track' ? 'bg-green-100 text-green-700' :
                kpi.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {kpi.status.replace('-', ' ')}
              </div>
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={handleAddKPI}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          Add KPI
        </button>
      )}
    </div>
  );
};

export default KPISection;