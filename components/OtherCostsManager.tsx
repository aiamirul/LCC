import React, { useState, useMemo } from 'react';
import type { OtherCost, OtherCostPreset } from '../types';
import { PresetIconDisplay } from './ExpensePresetSelector';

interface OtherCostsManagerProps {
    costs: OtherCost[];
    onAdd: (newCost: { label: string; cost: number }) => void;
    onRemove: (id: string) => void;
    presets: OtherCostPreset[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const RemoveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AddIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CustomCostForm: React.FC<{ onAdd: (newCost: { label: string, cost: number }) => void, onBack: () => void }> = ({ onAdd, onBack }) => {
    const [customLabel, setCustomLabel] = useState('');
    const [cost, setCost] = useState<number | ''>('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCost = Number(cost);
        if (!customLabel.trim() || finalCost <= 0) {
            setError('Please enter a name and a valid positive cost.');
            return;
        }
        onAdd({ label: customLabel.trim(), cost: finalCost });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h4 className="text-lg font-bold text-brand-dark">Add a Custom Cost</h4>
             <div>
                <label htmlFor="other-cost-label" className="block text-sm font-medium text-slate-600 mb-1">
                    Expense Name
                </label>
                <input
                    id="other-cost-label"
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g., Llama Grooming"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    autoFocus
                />
            </div>
            <div>
                <label htmlFor="other-cost-amount" className="block text-sm font-medium text-slate-600 mb-1">
                    Monthly Cost
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                    <input
                        id="other-cost-amount"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        placeholder="0"
                        className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Back to Presets</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                    Add Custom Cost
                </button>
            </div>
        </form>
    );
};

export const OtherCostsManager: React.FC<OtherCostsManagerProps> = ({ costs, onAdd, onRemove, presets }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomForm, setShowCustomForm] = useState(false);

    const filteredPresets = useMemo(() =>
        presets.filter(preset =>
          preset.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [presets, searchTerm]);

    const handleAddPreset = (preset: { label: string, cost: number }) => {
        onAdd(preset);
        setIsModalOpen(false);
    };
    
    const handleAddCustom = (newCost: { label: string, cost: number }) => {
        onAdd(newCost);
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
        setSearchTerm('');
        setShowCustomForm(false);
    };

    const totalOtherCosts = costs.reduce((acc, curr) => acc + curr.cost, 0);

    return (
        <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-3">Additional Monthly Costs</h2>
            
             <div className="space-y-3 mb-4">
                {costs.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg">
                        <ul className="divide-y divide-slate-200 p-2 max-h-60 overflow-y-auto">
                            {costs.map((c) => (
                                <li key={c.id} className="flex justify-between items-center py-2 px-2 group">
                                    <span className="text-slate-800">{c.label}</span>
                                    <div className="flex items-center">
                                        <span className="font-semibold text-slate-600 mr-4">{formatCurrency(c.cost)}</span>
                                        <button onClick={() => onRemove(c.id)} aria-label={`Remove ${c.label}`} className="text-slate-400 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100">
                                            <RemoveIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-center py-2 px-4 border-t-2 border-slate-200 bg-slate-50 rounded-b-lg">
                            <span className="text-slate-600 font-bold">Subtotal</span>
                            <span className="font-bold text-brand-dark">{formatCurrency(totalOtherCosts)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg py-8">
                        <p>No additional costs added yet.</p>
                    </div>
                )}
            </div>
            
            <button
                onClick={openModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
                <AddIcon className="h-6 w-6"/> Add Cost
            </button>


            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                            <h3 className="text-lg font-bold text-brand-dark">Add an Additional Cost</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                        </header>
                        
                         <div className="p-4 border-b flex-shrink-0">
                            {showCustomForm ? (
                                 <CustomCostForm onAdd={handleAddCustom} onBack={() => setShowCustomForm(false)} />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Search expenses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                                    autoFocus
                                />
                            )}
                        </div>

                        {!showCustomForm && (
                            <div className="overflow-y-auto p-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                    <button
                                      onClick={() => setShowCustomForm(true)}
                                      className="text-left p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary flex flex-col justify-between items-center text-center w-40 h-40 bg-slate-50 hover:bg-slate-100 border-2 border-dashed"
                                    >
                                      <AddIcon className="h-16 w-16 mb-2 text-brand-primary"/>
                                      <p className="font-semibold text-sm leading-tight">Add Custom Cost</p>
                                      <p className="text-xs text-slate-500">Enter a unique expense</p>
                                    </button>
                                    {filteredPresets.map(preset => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handleAddPreset(preset)}
                                            className="text-left p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary flex flex-col justify-between items-center text-center w-40 h-40 hover:bg-brand-light"
                                        >
                                            <PresetIconDisplay preset={preset} className="h-16 w-16 mb-2" />
                                            <p className="font-semibold text-sm leading-tight">{preset.label}</p>
                                            <p className="text-xs text-brand-secondary font-bold">{formatCurrency(preset.cost)}</p>
                                        </button>
                                    ))}
                                </div>
                                {filteredPresets.length === 0 && (
                                    <p className="text-center text-slate-500 p-8">No options found matching "{searchTerm}".</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};