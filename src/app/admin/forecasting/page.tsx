"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, BarChart3, Clock, PackageCheck } from "lucide-react";

const mockForecast = [
  { month: "Aug", actual: 120, predicted: 120 },
  { month: "Sep", actual: 150, predicted: 155 },
  { month: "Oct (Navratri)", actual: 0, predicted: 320 },
  { month: "Nov (Diwali)", actual: 0, predicted: 450 },
  { month: "Dec (Weddings)", actual: 0, predicted: 500 },
];

export default function ForecastingPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true); // default to true for immediate visual

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark flex items-center gap-3">
            AI Demand Forecasting <Sparkles className="text-primary" size={24} />
          </h1>
          <p className="text-foreground/60 text-sm mt-1">Predictive analytics for inventory and supply chain optimization.</p>
        </div>
        <button 
          onClick={() => {
            setAnalyzing(true);
            setAnalyzed(false);
            setTimeout(() => {
              setAnalyzing(false);
              setAnalyzed(true);
            }, 2000);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          {analyzing ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
          ) : (
            <><TrendingUp size={16} /> Re-Run Analysis</>
          )}
        </button>
      </div>

      {analyzing ? (
        <div className="h-[500px] flex flex-col items-center justify-center bg-white border border-black/10 rounded-sm">
          <Sparkles className="text-primary animate-ping mb-4" size={32} />
          <p className="font-serif text-xl animate-pulse">Running Neural Network Models...</p>
          <p className="text-xs text-foreground/50 uppercase tracking-widest mt-2">Processing historical sales & calendar events</p>
        </div>
      ) : analyzed && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-black/10 rounded-sm shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-sm">
                  <AlertTriangle size={20} />
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-widest">High Risk</span>
              </div>
              <h3 className="text-2xl font-bold font-sans mb-1">Banarasi Silk</h3>
              <p className="text-sm text-foreground/60">Predicted to stock out before Diwali. Recommend ordering 500m immediately.</p>
            </div>
            
            <div className="bg-white p-6 border border-black/10 rounded-sm shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-sm">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest">+45%</span>
              </div>
              <h3 className="text-2xl font-bold font-sans mb-1">Festive Demand</h3>
              <p className="text-sm text-foreground/60">Overall platform volume predicted to surge 45% YoY in Q4.</p>
            </div>

            <div className="bg-white p-6 border border-black/10 rounded-sm shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-sm">
                  <PackageCheck size={20} />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-widest">Optimized</span>
              </div>
              <h3 className="text-2xl font-bold font-sans mb-1">Cotton Lining</h3>
              <p className="text-sm text-foreground/60">Inventory levels are perfectly balanced for Q4 projections.</p>
            </div>
          </div>

          {/* Simulated Chart Area */}
          <div className="bg-white border border-black/10 rounded-sm shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                <BarChart3 size={24} className="text-primary" /> Q4 Sales Volume Projection
              </h3>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-dark"></div> Actual</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary border border-primary border-dashed bg-opacity-20"></div> AI Predicted</div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 border-l border-b border-black/10 pb-2 pl-2">
              {mockForecast.map((data, idx) => (
                <div key={idx} className="relative flex-1 flex flex-col items-center justify-end group">
                  
                  {/* Actual Bar */}
                  {data.actual > 0 && (
                    <div 
                      className="w-1/2 bg-dark rounded-t-sm z-10 transition-all duration-500 ease-out hover:bg-black"
                      style={{ height: `${(data.actual / 500) * 100}%` }}
                    />
                  )}
                  
                  {/* Predicted Bar */}
                  <div 
                    className={`w-1/2 rounded-t-sm absolute bottom-0 transition-all duration-500 delay-100 ${data.actual > 0 ? 'bg-primary/30 border-2 border-primary border-dashed' : 'bg-primary/20 border-2 border-primary border-dashed'}`}
                    style={{ height: `${(data.predicted / 500) * 100}%` }}
                  />

                  <div className="absolute -bottom-8 text-xs font-medium text-foreground/60 whitespace-nowrap">
                    {data.month}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-dark text-white text-xs px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                    {data.actual > 0 ? `Actual: ${data.actual}` : `Predicted: ${data.predicted}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-secondary/20 border border-black/10 rounded-sm p-8 mt-12">
            <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> AI Actionable Insights
            </h3>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <ArrowUpRight size={16} className="text-primary shrink-0 mt-0.5" />
                <span><strong>Shift Inventory:</strong> Move 30% of Silk stock from Bangalore warehouse to Delhi to meet predicted Diwali regional demand.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowUpRight size={16} className="text-primary shrink-0 mt-0.5" />
                <span><strong>Vendor Alert:</strong> Send automated restocking alerts to your top 3 sellers regarding 'Bridal Wear' categories.</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                <span><strong>Pricing Strategy:</strong> Predicted 12% price elasticity on premium fabrics during November. Safe to increase margins slightly.</span>
              </li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
