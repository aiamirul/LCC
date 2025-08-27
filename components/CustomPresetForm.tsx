
import React, { useState } from 'react';
import type { ExpenseCategory, ExpensePreset } from '../types';

interface CustomPresetFormProps {
    onAddPreset: (category: ExpenseCategory, preset: ExpensePreset) => void;
}

export const CustomPresetForm: React.FC<CustomPresetFormProps> = ({ onAddPreset }) => {
    const [category, setCategory] = useState<ExpenseCategory>('leisure');
    const [label, setLabel] = useState('');
    const [cost, setCost] = useState<number | ''>('');
    const [iconUrl, setIconUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label || cost === '') {
            setError('Please fill out all fields with valid values.');
            return;
        }

        const newPreset: ExpensePreset = {
            id: `${category}-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            label,
            cost: Number(cost),
            iconUrl: iconUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=${label.charAt(0)}`,
            isCustom: true,
        };
        
        onAddPreset(category, newPreset);

        // Reset form
        setLabel('');
        setCost('');
        setIconUrl('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <select 
                    id="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                >
                    <option value="housing">Housing</option>
                    <option value="groceries">Groceries</option>
                    <option value="car">Cars & Transport</option>
                    <option value="leisure">Leisure</option>
                    <option value="travel">Travel</option>
                </select>
            </div>
             <div>
                <label htmlFor="label" className="block text-sm font-medium text-slate-600 mb-1">Expense Name</label>
                <input 
                    id="label"
                    type="text" 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Private Jet Rental"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            <div>
                <label htmlFor="cost" className="block text-sm font-medium text-slate-600 mb-1">
                    Cost ({category === 'travel' ? 'Annual' : 'Monthly'})
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                    <input 
                        id="cost"
                        type="number" 
                        value={cost}
                        onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        placeholder="0"
                        className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
            </div>
             <div>
                <label htmlFor="iconUrl" className="block text-sm font-medium text-slate-600 mb-1">Icon URL (Optional)</label>
                <input 
                    id="iconUrl"
                    type="text" 
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://.../image.png"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button 
                type="submit"
                className="w-full px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
                Add Custom Preset
            </button>
        </form>
    );
};