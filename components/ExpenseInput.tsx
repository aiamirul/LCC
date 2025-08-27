
import React from 'react';

interface ExpenseInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  helperText?: string;
  prefix?: string;
}

export const ExpenseInput: React.FC<ExpenseInputProps> = ({ label, value, onChange, disabled = false, helperText, prefix = '$' }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">{prefix}</span>}
        <input
          type="number"
          value={isNaN(value) ? '' : value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${prefix ? 'pl-7' : 'pl-4'} pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out disabled:bg-slate-100 disabled:cursor-not-allowed`}
          placeholder="0"
          min="0"
        />
      </div>
       {helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
};
