import React, { useState, useMemo } from 'react';
import type { ExpensePreset } from '../types';

interface ExpensePresetSelectorProps {
  label: string;
  presets: ExpensePreset[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isAnnualCost?: boolean;
}

const formatCurrency = (amount: number, isAnnual = false): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted}${isAnnual ? '/year' : '/month'}`;
};

// FIX: Exported PresetIconDisplay to allow its use in other components.
export const PresetIconDisplay: React.FC<{ preset: ExpensePreset, className?: string }> = ({ preset, className = 'h-8 w-8' }) => {
  const isEmbed = preset.iconUrl && preset.iconUrl.trim().startsWith('<');

  if (isEmbed) {
    return (
      <div
        className={`${className} rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center`}
      >
        <div
          className="w-full h-full [&>*]:w-full [&>*]:h-full"
          dangerouslySetInnerHTML={{ __html: preset.iconUrl }}
        />
      </div>
    );
  }

  if (preset.iconUrl) {
    return <img src={preset.iconUrl} alt={preset.label} className={`${className} rounded-xl object-cover bg-slate-200`} onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=?")} />;
  }
  const Icon = preset.icon;
  return Icon ? <Icon className={`${className} text-brand-primary`} /> : <div className={`${className} bg-slate-200 rounded-xl`}></div>;
};

export const ExpensePresetSelector: React.FC<ExpensePresetSelectorProps> = ({ label, presets, selectedIds, onSelectionChange, isAnnualCost = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedPresets = useMemo(() =>
    presets.filter(p => selectedIds.includes(p.id)),
  [presets, selectedIds]);

  const categoryTotalCost = useMemo(() =>
      selectedPresets.reduce((sum, p) => sum + p.cost, 0),
  [selectedPresets]);

  const monthlyAvgCost = isAnnualCost ? categoryTotalCost / 12 : categoryTotalCost;

  const filteredPresets = useMemo(() =>
    presets.filter(preset =>
      preset.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [presets, searchTerm]);

  const handleToggle = (preset: ExpensePreset) => {
    const newSelectedIds = selectedIds.includes(preset.id)
      ? selectedIds.filter(id => id !== preset.id)
      : [...selectedIds, preset.id];
    onSelectionChange(newSelectedIds);
  };
  
  const handleClear = () => {
    onSelectionChange([]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left bg-white p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out flex items-center justify-between hover:border-brand-primary"
      >
        <div className="flex items-center">
            <div className="flex -space-x-3 mr-3 items-center">
              {selectedPresets.length > 0 
                ? selectedPresets.slice(0, 3).map(p => <PresetIconDisplay key={p.id} preset={p} className="h-8 w-8 ring-2 ring-white"/>) 
                : <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
              }
               {selectedPresets.length > 3 && <span className="text-xs pl-4 text-slate-500">+{selectedPresets.length - 3}</span>}
            </div>
            <div>
                <p className="font-semibold text-slate-800">{selectedPresets.length > 0 ? `${selectedPresets.length} item(s) selected` : 'None selected'}</p>
                <div className="flex items-baseline">
                    <p className="text-sm text-brand-secondary font-bold">{formatCurrency(categoryTotalCost, isAnnualCost)}</p>
                    {isAnnualCost && categoryTotalCost > 0 && (
                         <p className="text-xs text-slate-500 ml-2">≈ ${monthlyAvgCost.toFixed(0)}/mo</p>
                    )}
                </div>
            </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-brand-dark">Select {label}</h3>
               <div className="flex items-center gap-4">
                  <button onClick={handleClear} className="text-sm font-medium text-brand-primary hover:underline disabled:text-slate-400 disabled:no-underline" disabled={selectedIds.length === 0}>Clear All</button>
                  <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
              </div>
            </header>
            <div className="p-4 border-b flex-shrink-0">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredPresets.map(preset => {
                  const isSelected = selectedIds.includes(preset.id);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleToggle(preset)}
                      className={`text-left p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary flex flex-col justify-between items-center text-center w-40 h-40 ${isSelected ? 'bg-indigo-100 ring-2 ring-brand-primary' : 'hover:bg-brand-light'}`}
                    >
                      <PresetIconDisplay preset={preset} className="h-16 w-16 mb-2" />
                      <p className="font-semibold text-sm leading-tight">{preset.label}</p>
                      <p className="text-xs text-brand-secondary font-bold">{formatCurrency(preset.cost, isAnnualCost)}</p>
                    </button>
                  );
                })}
              </div>
                 {filteredPresets.length === 0 && (
                    <p className="text-center text-slate-500 p-8">No options found matching "{searchTerm}".</p>
                )}
            </div>
             <footer className="p-4 border-t text-right flex-shrink-0">
                <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Done</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};