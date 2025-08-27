
import React, { useEffect, useRef } from 'react';
import type { Chart, ChartConfiguration, TooltipItem } from 'chart.js';
import type { PlotPoint } from '../types';

// This is necessary because Chart.js is loaded from a CDN.
declare global {
  interface Window {
    Chart: any;
  }
}

interface ProjectionPlotProps {
  data: PlotPoint[];
  retirementAge: number;
}

export const ProjectionPlot: React.FC<ProjectionPlotProps> = ({ data, retirementAge }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || typeof window.Chart === 'undefined') return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy the previous chart instance before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    const maxSavings = Math.max(...data.map(p => p.savings), 1);

    const config: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [{
                label: 'Projected Savings',
                data: data.map(p => ({ x: p.age, y: p.savings })),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                pointRadius: 0,
                tension: 0.2,
            },
            {
                type: 'line',
                label: 'Retirement',
                data: [
                    { x: retirementAge, y: Math.min(...data.map(d => d.savings)) },
                    { x: retirementAge, y: Math.max(...data.map(d => d.savings)) },
                ],
                borderColor: '#10b981',
                borderWidth: 2,
                borderDash: [6, 6],
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        callback: function(value: string | number) {
                            if (typeof value === 'number') {
                                if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                                if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                                return `$${value}`;
                            }
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(203, 213, 225, 0.5)',
                    }
                },
                x: {
                    type: 'linear',
                    grid: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Age'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems: TooltipItem<'line'>[]) {
                            const age = tooltipItems[0]?.label;
                            if (age) {
                                return `Age: ${age}`;
                            }
                            return '';
                        },
                        label: function(context: TooltipItem<'line'>) {
                            let label = context.dataset.label || '';
                            if (label === 'Retirement') return `Retirement at ${retirementAge}`;
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
            }
        },
    };

    chartRef.current = new window.Chart(ctx, config);

    // Cleanup function to destroy the chart on component unmount
    return () => {
      chartRef.current?.destroy();
    };
  }, [data, retirementAge]);

  return <div className="h-64"><canvas ref={canvasRef}></canvas></div>;
};
