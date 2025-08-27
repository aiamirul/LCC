import type { ExpensePreset, ExpenseCategory } from '../types';

type PresetGroup = {
  [key in ExpenseCategory]: ExpensePreset[];
};

/**
 * Exports user's custom presets to a downloadable CSV file.
 */
export const exportPresetsToCSV = (presets: ExpensePreset[]) => {
  const customPresets = presets.filter(p => p.isCustom);
  if (customPresets.length === 0) {
    alert("No custom presets to export!");
    return;
  }
  
  // Find which category a preset belongs to (this is a bit hacky)
  const getCategory = (id: string): ExpenseCategory => {
      if(id.startsWith('housing')) return 'housing';
      if(id.startsWith('groceries')) return 'groceries';
      if(id.startsWith('car')) return 'car';
      if(id.startsWith('leisure')) return 'leisure';
      if(id.startsWith('travel')) return 'travel';
      return 'leisure'; // fallback
  }

  const header = 'category,id,label,cost,iconUrl,isCustom\n';
  const csvRows = customPresets.map(p => {
    const category = getCategory(p.id);
    const row = [
        category,
        p.id,
        `"${p.label.replace(/"/g, '""')}"`, // Handle quotes in label
        p.cost,
        p.iconUrl || '',
        'true'
    ];
    return row.join(',');
  });

  const csvString = header + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'lifestyle_presets.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Imports presets from a CSV file.
 */
export const importPresetsFromCSV = (file: File): Promise<Partial<PresetGroup>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        return reject(new Error("File is empty."));
      }

      const rows = text.split('\n').slice(1); // Skip header
      const importedPresets: Partial<PresetGroup> = {};

      rows.forEach(rowStr => {
        if (!rowStr.trim()) return; // Skip empty rows

        // Simple CSV parsing - might not handle all edge cases like commas in quoted strings perfectly
        const row = rowStr.split(',');

        const preset: ExpensePreset = {
          id: row[1],
          label: row[2].replace(/^"|"$/g, '').replace(/""/g, '"'),
          cost: parseFloat(row[3]),
          iconUrl: row[4] || undefined,
          isCustom: row[5] === 'true',
        };

        const category = row[0] as ExpenseCategory;
        if (!importedPresets[category]) {
          importedPresets[category] = [];
        }
        importedPresets[category]?.push(preset);
      });

      resolve(importedPresets);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};
