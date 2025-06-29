import React, { useState } from 'react';
import { Settings, Cable, Plus, X } from 'lucide-react';
import { Switch, Connection } from '../types/eniac';
import { useLanguage } from '../hooks/useLanguage';

interface ProgrammingPanelProps {
  switches: Switch[];
  connections: Connection[];
  onSwitchChange: (switchId: string, position: number) => void;
  onConnectionAdd: (from: string, to: string) => void;
  onConnectionRemove: (connectionId: string) => void;
}

export const ProgrammingPanel: React.FC<ProgrammingPanelProps> = ({
  switches,
  connections,
  onSwitchChange,
  onConnectionAdd,
  onConnectionRemove,
}) => {
  const { t } = useLanguage();
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({ from: '', to: '' });

  // Available connection points
  const connectionPoints = [
    ...Array.from({ length: 20 }, (_, i) => ({ id: `acc${i + 1}`, label: `Accumulator ${i + 1}` })),
    ...switches.map(s => ({ id: s.id, label: s.label })),
    { id: 'master_programmer', label: 'Master Programmer' },
    { id: 'multiplier', label: 'Multiplier' },
    { id: 'divider', label: 'Divider/Square Rooter' },
    { id: 'function_table_1', label: 'Function Table 1' },
    { id: 'function_table_2', label: 'Function Table 2' },
    { id: 'function_table_3', label: 'Function Table 3' },
    { id: 'printer', label: 'Printer' },
    { id: 'card_reader', label: 'Card Reader' },
    { id: 'constant_transmitter', label: 'Constant Transmitter' },
  ];

  const handleAddConnection = () => {
    if (newConnection.from && newConnection.to && newConnection.from !== newConnection.to) {
      onConnectionAdd(newConnection.from, newConnection.to);
      setNewConnection({ from: '', to: '' });
      setShowAddConnection(false);
    }
  };

  const getConnectionPointLabel = (id: string) => {
    const point = connectionPoints.find(p => p.id === id);
    return point ? point.label : id;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('programming')}
        </h3>
      </div>
      
      <div className="space-y-6">
        {/* Switches Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
            {t('switches')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {switches.map((switch_) => (
              <div key={switch_.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  {switch_.label}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max={switch_.maxPosition}
                    value={switch_.position}
                    onChange={(e) => onSwitchChange(switch_.id, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="w-8 text-sm font-mono text-center text-gray-900 dark:text-white">
                    {switch_.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connections Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t('connections')}
            </h4>
            <button
              onClick={() => setShowAddConnection(!showAddConnection)}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Connection
            </button>
          </div>

          {/* Add Connection Form */}
          {showAddConnection && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    From:
                  </label>
                  <select
                    value={newConnection.from}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="">Select source...</option>
                    {connectionPoints.map(point => (
                      <option key={point.id} value={point.id}>
                        {point.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    To:
                  </label>
                  <select
                    value={newConnection.to}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="">Select destination...</option>
                    {connectionPoints.map(point => (
                      <option key={point.id} value={point.id}>
                        {point.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddConnection}
                  disabled={!newConnection.from || !newConnection.to || newConnection.from === newConnection.to}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Create Connection
                </button>
                <button
                  onClick={() => {
                    setShowAddConnection(false);
                    setNewConnection({ from: '', to: '' });
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Connections */}
          <div className="space-y-2">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <Cable className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getConnectionPointLabel(connection.from)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">→</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getConnectionPointLabel(connection.to)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onConnectionRemove(connection.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Remove connection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {connections.length === 0 && !showAddConnection && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Cable className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No connections configured</p>
                <p className="text-xs mt-1">Click "Add Connection" to create cable connections</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};