export interface SelectOption {
  value: string;
  label: string;
}

export interface ExpensePreset {
  id: string;
  label: string;
  cost: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconUrl?: string;
  isCustom?: boolean;
}

export interface SarcasticComment {
  title: string;
  message: string;
  colorClass: string;
}

export type ExpenseCategory = 'housing' | 'groceries' | 'car' | 'leisure' | 'travel';

export interface OtherCost {
  id: string;
  label: string;
  cost: number;
}

export interface OtherCostPreset {
  id: string;
  label: string;
  cost: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconUrl?: string;
}

export interface PlotPoint {
  age: number;
  savings: number;
}

export interface ProjectionData {
  plotData: PlotPoint[];
  savingsAtRetirement: number;
  yearsOfSavingsPostRetirement: number;
  ageAtBankruptcy: number | null; // null if savings never run out
  commentary: {
    title: string;
    message: string;
    colorClass: string;
  };
}
