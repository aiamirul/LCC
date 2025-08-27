
import React from 'react';
import { ExpenseInput } from './ExpenseInput';
import { SavingsIcon } from './Icons';
import { ProjectionPlot } from './ProjectionPlot';
import type { ProjectionData } from '../types';

interface ProjectionCardProps {
  p1Age: number;
  setP1Age: (age: number) => void;
  p2Age: number;
  setP2Age: (age: number) => void;
  currentSavings: number;
  setCurrentSavings: (savings: number) => void;
  retirementAge: number;
  setRetirementAge: (age: number) => void;
  savingsReturnRate: number;
  setSavingsReturnRate: (rate: number) => void;
  projectionData: ProjectionData;
}

const Stat: React.FC<{ label: string; value: string | number; className?: string; }> = ({ label, value, className }) => (
  <div className="text-center">
    <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold ${className}`}>{value}</p>
  </div>
);

export const ProjectionCard: React.FC<ProjectionCardProps> = ({
  p1Age, setP1Age, p2Age, setP2Age, currentSavings, setCurrentSavings, retirementAge, setRetirementAge, savingsReturnRate, setSavingsReturnRate, projectionData
}) => {

  const handleAgeChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setter(isNaN(val) ? 0 : val);
  };
  
  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentSavings(isNaN(val) ? 0 : val);
  };

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setRetirementAge(isNaN(val) ? 0 : val);
  };
  
  const handleReturnRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSavingsReturnRate(isNaN(val) ? 0 : val);
  };

  const maxAge = Math.max(p1Age, p2Age);
  const minRetirementAge = maxAge > 0 ? maxAge + 1 : 1;
  
  // Ensure retirement age is valid
  React.useEffect(() => {
    if (retirementAge <= maxAge) {
      setRetirementAge(minRetirementAge);
    }
  }, [p1Age, p2Age, retirementAge, setRetirementAge, maxAge, minRetirementAge]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-8 mt-8">
        <div className="flex items-center text-2xl font-bold text-brand-dark mb-4 border-b pb-3">
          <SavingsIcon className="h-8 w-8 mr-3 text-brand-secondary" />
          <h2>Retirement & Savings Projection</h2>
        </div>
        
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ExpenseInput label="Partner 1 Age" value={p1Age} onChange={handleAgeChange(setP1Age)} prefix="" />
            <ExpenseInput label="Partner 2 Age" value={p2Age} onChange={handleAgeChange(setP2Age)} prefix="" />
            <div className="md:col-span-2">
                <ExpenseInput label="Current Combined Savings" value={currentSavings} onChange={handleSavingsChange} />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="savingsReturnRate" className="block text-sm font-medium text-slate-600 mb-2">
                    Annual Savings Return (%): <span className="font-bold text-brand-primary">{savingsReturnRate}</span>
                </label>
                <input
                    id="savingsReturnRate"
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={savingsReturnRate}
                    onChange={handleReturnRateChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
            </div>
        </div>

        {/* Retirement Slider */}
        <div className="mb-6">
            <label htmlFor="retirementAge" className="block text-sm font-medium text-slate-600 mb-2">
                Desired Retirement Age: <span className="font-bold text-brand-primary">{retirementAge}</span>
            </label>
            <input
                id="retirementAge"
                type="range"
                min={minRetirementAge}
                max="80"
                value={retirementAge}
                onChange={handleRetirementAgeChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
        </div>
        
        {/* Plot */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-2">Savings Over Time</h3>
            {projectionData && projectionData.plotData.length > 0 ? (
                <ProjectionPlot data={projectionData.plotData} retirementAge={retirementAge} />
            ) : (
                <div className="h-64 flex items-center justify-center bg-slate-100 rounded-lg">
                    <p className="text-slate-500">Calculating projection...</p>
                </div>
            )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
           <Stat label="At Retirement" value={projectionData.savingsAtRetirement.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})} className="text-brand-primary" />
           <Stat label="Years of Savings" value={projectionData.yearsOfSavingsPostRetirement > 50 ? '50+' : projectionData.yearsOfSavingsPostRetirement.toFixed(1)} className="text-brand-secondary" />
           <Stat label="Bankruptcy Age" value={projectionData.ageAtBankruptcy ?? 'Never!'} className={projectionData.ageAtBankruptcy ? 'text-red-500' : 'text-green-500'} />
        </div>

        {/* Commentary */}
        <div className={`p-4 rounded-lg border-l-4 ${projectionData.commentary.colorClass}`}>
            <h3 className="font-bold">{projectionData.commentary.title}</h3>
            <p className="text-sm mt-1">{projectionData.commentary.message}</p>
        </div>

    </div>
  );
};
