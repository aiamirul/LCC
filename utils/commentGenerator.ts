import { comments } from '../constants';
import type { SarcasticComment } from '../types';

export const getSarcasticComment = (
  totalIncome: number, 
  totalExpenses: number, 
  housingIds: string[], 
  groceriesIds: string[]
): SarcasticComment => {
  const netIncome = totalIncome - totalExpenses;
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : Infinity;

  if (totalExpenses < 0) {
    return comments.sideHustle;
  }

  if (housingIds.includes('homeless') && groceriesIds.includes('no-eating')) {
    return comments.minimalist;
  }

  if (totalIncome === 0 && totalExpenses > 0) {
    return comments.thoughtsAndPrayers;
  }
  
  if (expenseRatio > 1.2) {
    return comments.bezosBozo;
  }

  if (netIncome < 0) {
    return comments.crying;
  }

  if (netIncome > 0 && netIncome < totalIncome * 0.1) {
    return comments.tightrope;
  }

  if (netIncome > totalIncome * 0.5) {
    return comments.hiring;
  }

  return comments.sustainable;
};
