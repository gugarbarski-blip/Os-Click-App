import React from 'react';
import { LayoutDashboard, Sparkles } from 'lucide-react';

interface HeaderProps {
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onGenerateReport, isGenerating }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">OS Control Pro</h1>
        </div>
        
        <button
          onClick={onGenerateReport}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-sm font-medium shadow-sm"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analisando...' : 'Análise IA'}</span>
        </button>
      </div>
    </header>
  );
};