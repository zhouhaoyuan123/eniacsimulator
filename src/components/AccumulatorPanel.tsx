import React from 'react';
import { Calculator, Zap } from 'lucide-react';
import { Accumulator } from '../types/eniac';
import { useLanguage } from '../hooks/useLanguage';

interface AccumulatorPanelProps {
  accumulators: Accumulator[];
  onValueChange: (id: number, value: number) => void;
}

export const AccumulatorPanel: React.FC<AccumulatorPanelProps> = ({
  accumulators,
  onValueChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('accumulators')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accumulators.map((acc) => (
          <div
            key={acc.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300
              ${acc.isActive 
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-lg' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('accumulator')} {acc.id}
              </span>
              {acc.isActive && (
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
              )}
            </div>
            
            <div className="font-mono text-lg font-bold text-gray-900 dark:text-white mb-2">
              {acc.value.toLocaleString()}
            </div>
            
            <div className="grid grid-cols-5 gap-1 mb-3">
              {acc.digits.map((digit, index) => (
                <div
                  key={index}
                  className={`
                    w-6 h-6 flex items-center justify-center text-xs font-mono rounded
                    ${acc.isActive 
                      ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {digit}
                </div>
              ))}
            </div>
            
            <input
              type="number"
              value={acc.value}
              onChange={(e) => onValueChange(acc.id, parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder={t('value')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};