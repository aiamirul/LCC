
import React from 'react';

const MoneyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1h-4zm-2 1h-2v1h2V7zm2 10v1h2v-1h-2zm-2 1h-2v1h2v-1zM6 9h.01M6 12h.01M6 15h.01M18 9h-.01M18 12h-.01M18 15h-.01M4 6h1v1H4V6zm14 0h1v1h-1V6zM4 17h1v1H4v-1zm14 0h1v1h-1v-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l.875 1.5M21 7l-.875 1.5M3 17l.875-1.5M21 17l-.875-1.5" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center">
        <MoneyIcon />
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">Couple's Lifestyle Cost Calculator</h1>
            <p className="text-sm text-slate-500">How much does your love *really* cost?</p>
        </div>
      </div>
    </header>
  );
};
