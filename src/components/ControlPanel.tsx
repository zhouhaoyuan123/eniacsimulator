import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  SkipForward, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Language } from '../types/eniac';

interface ControlPanelProps {
  isRunning: boolean;
  currentStep: number;
  cycleCount: number;
  onStart: () => void;
  onStop: () => void;
  onStep: () => void;
  onReset: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  currentStep,
  cycleCount,
  onStart,
  onStop,
  onStep,
  onReset,
  onClear,
  onExport,
  onImport,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showImport, setShowImport] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      setShowImport(false);
    }
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('controls')}
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-3 py-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {isRunning ? t('running') : t('ready')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('status')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentStep}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('step_count')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{cycleCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('cycle')}</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button
          onClick={isRunning ? onStop : onStart}
          className={`
            flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }
          `}
        >
          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? t('stop') : t('run')}
        </button>
        
        <button
          onClick={onStep}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all"
        >
          <SkipForward className="w-4 h-4" />
          {t('step')}
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          {t('reset')}
        </button>
        
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
        >
          <Trash2 className="w-4 h-4" />
          {t('clear')}
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
        >
          <Download className="w-4 h-4" />
          {t('export')}
        </button>
      </div>

      {/* Import Section */}
      <div className="border-t dark:border-gray-700 pt-4">
        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-all"
        >
          <Upload className="w-4 h-4" />
          {t('import')}
        </button>
        
        {showImport && (
          <div className="mt-3">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};