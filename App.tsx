
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ExpenseInput } from './components/ExpenseInput';
import { SummaryCard } from './components/SummaryCard';
import { ExpensePresetSelector } from './components/ExpensePresetSelector';
import { CustomPresetForm } from './components/CustomPresetForm';
import { OtherCostsManager } from './components/OtherCostsManager';
import { ProjectionCard } from './components/ProjectionCard';
import { 
  housingPresets as defaultHousingPresets, 
  groceriesPresets as defaultGroceriesPresets, 
  carPresets as defaultCarPresets, 
  leisurePresets as defaultLeisurePresets, 
  travelPresets as defaultTravelPresets,
  otherCostPresets as defaultOtherCostPresets
} from './constants';
import type { SarcasticComment, ExpensePreset, ExpenseCategory, OtherCost, OtherCostPreset, ProjectionData, PlotPoint } from './types';
import { getSarcasticComment } from './utils/commentGenerator';
import { exportPresetsToCSV, importPresetsFromCSV } from './utils/csvUtils';

type AllPresets = {
  housing: ExpensePreset[];
  groceries: ExpensePreset[];
  car: ExpensePreset[];
  leisure: ExpensePreset[];
  travel: ExpensePreset[];
};

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [partner1Income, setPartner1Income] = useState<number>(2500);
  const [partner2Income, setPartner2Income] = useState<number>(3000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Projection state
  const [partner1Age, setPartner1Age] = useState<number>(30);
  const [partner2Age, setPartner2Age] = useState<number>(32);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [retirementAge, setRetirementAge] = useState<number>(65);


  // Preset state, initialized with defaults
  const [housingPresets, setHousingPresets] = useState<ExpensePreset[]>(defaultHousingPresets);
  const [groceriesPresets, setGroceriesPresets] = useState<ExpensePreset[]>(defaultGroceriesPresets);
  const [carPresets, setCarPresets] = useState<ExpensePreset[]>(defaultCarPresets);
  const [leisurePresets, setLeisurePresets] = useState<ExpensePreset[]>(defaultLeisurePresets);
  const [travelPresets, setTravelPresets] = useState<ExpensePreset[]>(defaultTravelPresets);

  // Other costs state
  const [otherCosts, setOtherCosts] = useState<OtherCost[]>([]);

  // State now holds arrays of selected preset IDs for each category
  const [selectedHousingIds, setSelectedHousingIds] = useState<string[]>(['apartment']);
  const [selectedGroceriesIds, setSelectedGroceriesIds] = useState<string[]>(['standard']);
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>(['sedan']);
  const [selectedLeisureIds, setSelectedLeisureIds] = useState<string[]>(['hobbies']);
  const [selectedTravelIds, setSelectedTravelIds] = useState<string[]>(['road-trip']);

  const allPresets: AllPresets = {
    housing: housingPresets,
    groceries: groceriesPresets,
    car: carPresets,
    leisure: leisurePresets,
    travel: travelPresets,
  };

  const allSetters = {
    housing: setHousingPresets,
    groceries: setGroceriesPresets,
    car: setCarPresets,
    leisure: setLeisurePresets,
    travel: setTravelPresets,
  };

  // Load custom data from localStorage on initial render
  useEffect(() => {
    try {
      const savedCustomPresetsRaw = localStorage.getItem('customPresets');
      if (savedCustomPresetsRaw) {
        const savedCustomPresets = JSON.parse(savedCustomPresetsRaw);
        setHousingPresets([...defaultHousingPresets, ...(savedCustomPresets.housing || [])]);
        setGroceriesPresets([...defaultGroceriesPresets, ...(savedCustomPresets.groceries || [])]);
        setCarPresets([...defaultCarPresets, ...(savedCustomPresets.car || [])]);
        setLeisurePresets([...defaultLeisurePresets, ...(savedCustomPresets.leisure || [])]);
        setTravelPresets([...defaultTravelPresets, ...(savedCustomPresets.travel || [])]);
      }

      const savedOtherCostsRaw = localStorage.getItem('otherCosts');
      if (savedOtherCostsRaw) {
        setOtherCosts(JSON.parse(savedOtherCostsRaw));
      }

      const savedProjection = localStorage.getItem('projectionState');
      if (savedProjection) {
        const { p1Age, p2Age, savings, retireAge } = JSON.parse(savedProjection);
        setPartner1Age(p1Age || 30);
        setPartner2Age(p2Age || 32);
        setCurrentSavings(savings || 50000);
        setRetirementAge(retireAge || 65);
      }

    } catch (error) {
      console.error("Failed to load custom data from localStorage", error);
    }
  }, []);

  // Save projection state to localStorage
  useEffect(() => {
    const projectionState = {
      p1Age: partner1Age,
      p2Age: partner2Age,
      savings: currentSavings,
      retireAge: retirementAge,
    };
    localStorage.setItem('projectionState', JSON.stringify(projectionState));
  }, [partner1Age, partner2Age, currentSavings, retirementAge]);


  // Save custom presets to localStorage whenever they change
  const saveCustomPresets = () => {
    const customPresets: Partial<AllPresets> = {
      housing: housingPresets.filter(p => p.isCustom),
      groceries: groceriesPresets.filter(p => p.isCustom),
      car: carPresets.filter(p => p.isCustom),
      leisure: leisurePresets.filter(p => p.isCustom),
      travel: travelPresets.filter(p => p.isCustom),
    };
    localStorage.setItem('customPresets', JSON.stringify(customPresets));
  };
  
  const addCustomPreset = (category: ExpenseCategory, preset: ExpensePreset) => {
    const setter = allSetters[category];
    setter(prev => [...prev, preset]);
  };

  useEffect(() => {
    saveCustomPresets();
  }, [housingPresets, groceriesPresets, carPresets, leisurePresets, travelPresets]);

  // Save other costs to localStorage
  useEffect(() => {
    localStorage.setItem('otherCosts', JSON.stringify(otherCosts));
  }, [otherCosts]);


  const addOtherCost = (newCost: { label: string; cost: number }) => {
    const costToAdd: OtherCost = {
      ...newCost,
      id: `other-${Date.now()}`,
    };
    setOtherCosts(prev => [...prev, costToAdd]);
  };

  const removeOtherCost = (id: string) => {
    setOtherCosts(prev => prev.filter(c => c.id !== id));
  };

  const handleImport = async (importedPresets: Partial<AllPresets>) => {
    Object.keys(importedPresets).forEach(catKey => {
      const category = catKey as ExpenseCategory;
      const setter = allSetters[category];
      const newPresets = importedPresets[category] || [];
      if (setter) {
        // Add new presets, avoiding duplicates by ID
        setter(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPresets = newPresets.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPresets];
        });
      }
    });
    alert('Presets imported successfully!');
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importPresetsFromCSV(file);
        await handleImport(imported);
      } catch (error) {
        alert(`Error importing presets: ${error instanceof Error ? error.message : String(error)}`);
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // --- CALCULATIONS ---
  const totalIncome = useMemo(() => partner1Income + partner2Income, [partner1Income, partner2Income]);

  const calculateTotalCost = (ids: string[], presets: ExpensePreset[], isAnnual = false) => {
    const total = ids.reduce((sum, id) => {
      const preset = presets.find(p => p.id === id);
      return sum + (preset?.cost || 0);
    }, 0);
    return isAnnual ? total / 12 : total;
  };

  const totalExpenses = useMemo(() => {
    const housingCost = calculateTotalCost(selectedHousingIds, housingPresets);
    const groceriesCost = calculateTotalCost(selectedGroceriesIds, groceriesPresets);
    const carCost = calculateTotalCost(selectedCarIds, carPresets);
    const leisureCost = calculateTotalCost(selectedLeisureIds, leisurePresets);
    const travelCost = calculateTotalCost(selectedTravelIds, travelPresets, true); // Annual cost
    const otherCostTotal = otherCosts.reduce((sum, cost) => sum + cost.cost, 0);

    return housingCost + groceriesCost + carCost + leisureCost + travelCost + otherCostTotal;
  }, [selectedHousingIds, selectedGroceriesIds, selectedCarIds, selectedLeisureIds, selectedTravelIds, housingPresets, groceriesPresets, carPresets, leisurePresets, travelPresets, otherCosts]);
  
  const netIncome = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const sarcasticComment = useMemo(
    () => getSarcasticComment(totalIncome, totalExpenses, selectedHousingIds, selectedGroceriesIds),
    [totalIncome, totalExpenses, selectedHousingIds, selectedGroceriesIds]
  );
  
  const combinedOtherCostPresets = useMemo<OtherCostPreset[]>(() => {
    const allLifestylePresets = [
        ...housingPresets,
        ...groceriesPresets,
        ...carPresets,
        ...leisurePresets,
        ...travelPresets.map(p => ({ ...p, cost: p.cost / 12, label: `${p.label} (Avg/Mo)` })),
    ];
    
    const combined = [...defaultOtherCostPresets, ...allLifestylePresets];
    
    // De-duplicate, favoring items from defaultOtherCostPresets if labels match
    const uniquePresets = Array.from(new Map(combined.map(p => [p.label, p])).values());

    // Sort alphabetically
    return uniquePresets.sort((a, b) => a.label.localeCompare(b.label));
}, [housingPresets, groceriesPresets, carPresets, leisurePresets, travelPresets]);


  const projectionData = useMemo<ProjectionData>(() => {
    const maxCurrentAge = Math.max(partner1Age, partner2Age, 1); // Avoid age 0
    const yearsToRetirement = Math.max(0, retirementAge - maxCurrentAge);

    let currentYearSavings = currentSavings;
    const plotData: PlotPoint[] = [{ age: maxCurrentAge, savings: currentYearSavings }];
    
    // Accumulate savings until retirement
    for (let i = 1; i <= yearsToRetirement; i++) {
        currentYearSavings += netIncome * 12;
        plotData.push({ age: maxCurrentAge + i, savings: Math.max(0, currentYearSavings) });
    }
    
    const savingsAtRetirement = Math.max(0, currentYearSavings);

    // Deplete savings after retirement
    let yearsOfSavingsPostRetirement = 0;
    let ageAtBankruptcy: number | null = null;
    const postRetirementExpenses = totalExpenses * 12;

    if (postRetirementExpenses <= 0) { // If expenses are negative or zero, savings grow forever
        yearsOfSavingsPostRetirement = Infinity;
        ageAtBankruptcy = null;
        for (let i = 1; i <= (100 - retirementAge); i++) {
            currentYearSavings -= postRetirementExpenses; // expenses are negative/zero, so this adds/maintains money
            plotData.push({ age: retirementAge + i, savings: currentYearSavings });
        }
    } else if (savingsAtRetirement > 0) {
        yearsOfSavingsPostRetirement = savingsAtRetirement / postRetirementExpenses;
        ageAtBankruptcy = retirementAge + yearsOfSavingsPostRetirement;

        let remainingSavings = savingsAtRetirement;
        for (let age = retirementAge + 1; age <= 100; age++) {
            remainingSavings -= postRetirementExpenses;
            plotData.push({ age, savings: Math.max(0, remainingSavings) });
            if (remainingSavings <= 0) break;
        }
    } else { // No savings at retirement
        ageAtBankruptcy = retirementAge;
    }
    
    const lastPlotPoint = plotData[plotData.length - 1];
    if (lastPlotPoint && lastPlotPoint.age < 100) {
        for (let age = lastPlotPoint.age + 1; age <= 100; age++) {
            plotData.push({ age, savings: 0 });
        }
    }

    let commentary;
    if (netIncome < 0 && savingsAtRetirement <= 0) {
        commentary = { title: "The Math Isn't Mathing", message: "You're spending more than you earn and will have no savings for retirement. This isn't a projection; it's a financial cliff.", colorClass: 'bg-red-100 border-red-500 text-red-700'};
    } else if (ageAtBankruptcy === null) {
        commentary = { title: "Financial Immortality Unlocked", message: "Your money will outlive you, your children, and possibly civilization itself. Well done.", colorClass: 'bg-green-100 border-green-500 text-green-700'};
    } else if (ageAtBankruptcy > 85) {
        commentary = { title: "The Golden Years are... Golden!", message: "You're set for a long and comfortable retirement. Your planning is solid.", colorClass: 'bg-green-100 border-green-500 text-green-700'};
    } else if (ageAtBankruptcy > retirementAge + 5) {
        commentary = { title: "A Comfortable Cushion", message: `You've got a runway post-retirement, but at age ${Math.floor(ageAtBankruptcy)}, the party's over. No sudden super-yacht purchases.`, colorClass: 'bg-yellow-100 border-yellow-500 text-yellow-700'};
    } else {
        commentary = { title: "Dangerously Short Runway", message: `You'll run out of money just ${yearsOfSavingsPostRetirement.toFixed(1)} years into retirement. Time to rethink... everything.`, colorClass: 'bg-red-100 border-red-500 text-red-700'};
    }
    
    return {
        plotData,
        savingsAtRetirement,
        yearsOfSavingsPostRetirement,
        ageAtBankruptcy: ageAtBankruptcy ? Math.floor(ageAtBankruptcy) : null,
        commentary,
    };
  }, [netIncome, totalExpenses, currentSavings, retirementAge, partner1Age, partner2Age]);

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs & Choices */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-3">Monthly Income</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ExpenseInput label="Partner 1's Net Monthly Income" value={partner1Income} onChange={(e) => setPartner1Income(parseFloat(e.target.value) || 0)} />
                    <ExpenseInput label="Partner 2's Net Monthly Income" value={partner2Income} onChange={(e) => setPartner2Income(parseFloat(e.target.value) || 0)} />
                </div>
            </section>
            
            <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-3">Lifestyle Choices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ExpensePresetSelector label="Housing" presets={housingPresets} selectedIds={selectedHousingIds} onSelectionChange={setSelectedHousingIds} />
                    <ExpensePresetSelector label="Groceries" presets={groceriesPresets} selectedIds={selectedGroceriesIds} onSelectionChange={setSelectedGroceriesIds} />
                    <ExpensePresetSelector label="Cars & Transport" presets={carPresets} selectedIds={selectedCarIds} onSelectionChange={setSelectedCarIds} />
                    <ExpensePresetSelector label="Leisure & Entertainment" presets={leisurePresets} selectedIds={selectedLeisureIds} onSelectionChange={setSelectedLeisureIds} />
                    <ExpensePresetSelector label="Travel (Annual)" presets={travelPresets} selectedIds={selectedTravelIds} onSelectionChange={setSelectedTravelIds} isAnnualCost />
                </div>
            </section>

            <OtherCostsManager costs={otherCosts} onAdd={addOtherCost} onRemove={removeOtherCost} presets={combinedOtherCostPresets} />

            <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-3">Custom Presets</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <CustomPresetForm onAddPreset={addCustomPreset} />
                   <div>
                       <p className="text-sm text-slate-600 mb-2">Manage your custom presets by exporting or importing them as a CSV file.</p>
                       <div className="flex gap-4">
                           <button onClick={() => exportPresetsToCSV(Object.values(allPresets).flat())} className="w-full px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-colors">Export Custom</button>
                           <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors">Import</button>
                           <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".csv" className="hidden" />
                       </div>
                   </div>
               </div>
            </section>
          </div>
          
          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <SummaryCard totalIncome={totalIncome} totalExpenses={totalExpenses} netIncome={netIncome} sarcasticComment={sarcasticComment} />
            <ProjectionCard 
              p1Age={partner1Age} setP1Age={setPartner1Age}
              p2Age={partner2Age} setP2Age={setPartner2Age}
              currentSavings={currentSavings} setCurrentSavings={setCurrentSavings}
              retirementAge={retirementAge} setRetirementAge={setRetirementAge}
              projectionData={projectionData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
