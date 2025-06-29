import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { ENIACEngine } from '../utils/eniacEngine';
import { ENIACState } from '../types/eniac';
import { AccumulatorPanel } from './AccumulatorPanel';
import { ProgrammingPanel } from './ProgrammingPanel';
import { ControlPanel } from './ControlPanel';
import { DocumentationPanel } from './DocumentationPanel';
import { useLanguage } from '../hooks/useLanguage';

export const ENIACSimulator: React.FC = () => {
  const { t } = useLanguage();
  const [engine] = useState(() => new ENIACEngine());
  const [state, setState] = useState<ENIACState>(engine.getState());
  const [activeTab, setActiveTab] = useState<'simulator' | 'documentation'>('simulator');

  useEffect(() => {
    const unsubscribe = engine.subscribe(setState);
    return unsubscribe;
  }, [engine]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRunning) {
      interval = setInterval(() => {
        engine.executeStep();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning, engine]);

  const handleExport = () => {
    const program = engine.exportState();
    const blob = new Blob([JSON.stringify(program, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eniac-program-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const program = JSON.parse(e.target?.result as string);
        engine.importState(program);
      } catch (error) {
        console.error('Failed to import program:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Cpu className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('subtitle')}
                </p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'simulator'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('simulator')}
              </button>
              <button
                onClick={() => setActiveTab('documentation')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'documentation'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('documentation')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulator' ? (
          <div className="space-y-8">
            {/* Control Panel */}
            <ControlPanel
              isRunning={state.isRunning}
              currentStep={state.currentStep}
              cycleCount={state.cycleCount}
              onStart={() => engine.start()}
              onStop={() => engine.stop()}
              onStep={() => engine.executeStep()}
              onReset={() => engine.reset()}
              onClear={() => engine.clear()}
              onExport={handleExport}
              onImport={handleImport}
            />

            {/* Accumulators */}
            <AccumulatorPanel
              accumulators={state.accumulators}
              onValueChange={(id, value) => engine.setAccumulatorValue(id, value)}
            />

            {/* Programming Panel */}
            <ProgrammingPanel
              switches={state.switches}
              connections={state.connections}
              onSwitchChange={(switchId, position) => engine.setSwitchPosition(switchId, position)}
              onConnectionAdd={(from, to) => engine.addConnection(from, to)}
              onConnectionRemove={(connectionId) => engine.removeConnection(connectionId)}
            />
          </div>
        ) : (
          <DocumentationPanel />
        )}
      </div>
    </div>
  );
};