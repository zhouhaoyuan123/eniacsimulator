import React, { useState } from 'react';
import { Book, ChevronDown, ChevronRight, Calculator, Zap, Settings, Cable, Play, Download, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Language } from '../types/eniac';

export const DocumentationPanel: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const SectionHeader: React.FC<{ id: string; title: string; icon: React.ReactNode }> = ({ id, title, icon }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
    >
      {icon}
      <span className="font-semibold text-gray-900 dark:text-white flex-1 text-left">{title}</span>
      {isExpanded(id) ? (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('documentation')}
          </h3>
        </div>
        
        {/* Language and Theme Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-1 text-sm border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={theme === 'light' ? t('dark') : t('light')}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('dark')}</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('light')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overview Section */}
        <div>
          <SectionHeader 
            id="overview" 
            title={t('overview')} 
            icon={<Book className="w-5 h-5 text-blue-500" />} 
          />
          {isExpanded('overview') && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {t('overview_description')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>{t('overview_point_1')}</li>
                <li>{t('overview_point_2')}</li>
                <li>{t('overview_point_3')}</li>
                <li>{t('overview_point_4')}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Getting Started Section */}
        <div>
          <SectionHeader 
            id="getting-started" 
            title={t('getting_started')} 
            icon={<Play className="w-5 h-5 text-emerald-500" />} 
          />
          {isExpanded('getting-started') && (
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step')} 1: {t('setup_accumulators')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('setup_accumulators_desc')}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step')} 2: {t('configure_switches')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('configure_switches_desc')}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step')} 3: {t('create_connections')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('create_connections_desc')}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step')} 4: {t('run_program')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('run_program_desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Components Section */}
        <div>
          <SectionHeader 
            id="components" 
            title={t('components')} 
            icon={<Settings className="w-5 h-5 text-amber-500" />} 
          />
          {isExpanded('components') && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">{t('accumulators')}</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('accumulators_desc')}</p>
              </div>
              
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">{t('switches')}</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('switches_desc')}</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Cable className="w-4 h-4 text-blue-600" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">{t('connections')}</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('connections_desc')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div>
          <SectionHeader 
            id="examples" 
            title={t('examples')} 
            icon={<Zap className="w-5 h-5 text-purple-500" />} 
          />
          {isExpanded('examples') && (
            <div className="mt-4 space-y-4">
              {/* Addition Example */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('example_addition')}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('example_addition_desc')}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    1. {t('example_addition_step1')}<br/>
                    2. {t('example_addition_step2')}<br/>
                    3. {t('example_addition_step3')}<br/>
                    4. {t('example_addition_step4')}
                  </div>
                </div>
              </div>

              {/* Multiplication Example */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('example_multiplication')}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('example_multiplication_desc')}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    1. {t('example_multiplication_step1')}<br/>
                    2. {t('example_multiplication_step2')}<br/>
                    3. {t('example_multiplication_step3')}<br/>
                    4. {t('example_multiplication_step4')}
                  </div>
                </div>
              </div>

              {/* Complex Program Example */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t('example_complex')}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('example_complex_desc')}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    1. {t('example_complex_step1')}<br/>
                    2. {t('example_complex_step2')}<br/>
                    3. {t('example_complex_step3')}<br/>
                    4. {t('example_complex_step4')}<br/>
                    5. {t('example_complex_step5')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div>
          <SectionHeader 
            id="tips" 
            title={t('tips_and_tricks')} 
            icon={<Zap className="w-5 h-5 text-yellow-500" />} 
          />
          {isExpanded('tips') && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  {t('tip_1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  {t('tip_2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  {t('tip_3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  {t('tip_4')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">💡</span>
                  {t('tip_5')}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Import/Export Section */}
        <div>
          <SectionHeader 
            id="import-export" 
            title={t('import_export')} 
            icon={<Download className="w-5 h-5 text-gray-500" />} 
          />
          {isExpanded('import-export') && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{t('export_programs')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('export_programs_desc')}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{t('import_programs')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('import_programs_desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};