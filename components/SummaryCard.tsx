
import React from 'react';
import type { SarcasticComment } from '../types';

interface SummaryCardProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  sarcasticComment: SarcasticComment;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const DataRow: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between items-center py-3">
        <span className="text-slate-600">{label}</span>
        <span className={`font-semibold ${className}`}>{value}</span>
    </div>
);


export const SummaryCard: React.FC<SummaryCardProps> = ({ totalIncome, totalExpenses, netIncome, sarcasticComment }) => {
    const isSustainable = netIncome >= 0;
    const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-8">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-3">Financial Snapshot</h2>
            
            <div className="space-y-2 mb-6">
                <DataRow label="Total Monthly Income" value={formatCurrency(totalIncome)} className="text-green-600" />
                <DataRow label="Total Monthly Expenses" value={formatCurrency(totalExpenses)} className="text-red-600" />
                <hr className="my-2"/>
                <DataRow 
                    label="Net Monthly Income" 
                    value={formatCurrency(netIncome)} 
                    className={`text-2xl ${isSustainable ? 'text-brand-secondary' : 'text-red-500'}`} 
                />
            </div>

            <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                <div 
                    className={`h-4 rounded-full ${isSustainable ? 'bg-brand-secondary' : 'bg-red-500'}`}
                    style={{ width: `${Math.max(0, Math.min(expensePercentage, 100))}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-500 text-center mb-6">
              {expensePercentage >= 0
                ? `You are spending ${expensePercentage.toFixed(0)}% of your income.`
                : `Your "expenses" are generating income equal to ${Math.abs(expensePercentage).toFixed(0)}% of your primary income!`}
            </p>

            <div className={`p-4 rounded-lg border-l-4 ${sarcasticComment.colorClass}`}>
                <h3 className="font-bold">{sarcasticComment.title}</h3>
                <p className="text-sm mt-1">{sarcasticComment.message}</p>
            </div>
            
            <div className={`mt-6 text-center p-4 rounded-lg ${isSustainable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                <p className="font-semibold text-lg">Your lifestyle is currently:</p>
                <p className={`text-3xl font-bold ${isSustainable ? 'text-green-600' : 'text-red-600'}`}>
                    {isSustainable ? 'SUSTAINABLE' : 'UNSUSTAINABLE'}
                </p>
            </div>
        </div>
    );
};