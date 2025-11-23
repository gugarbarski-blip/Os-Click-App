import React from 'react';
import { X, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Note: In a real setup, would need this package. 
// Since I cannot install packages, I will render simple text or use a simple custom renderer logic if needed.
// For this output, I will just display preserved whitespace text to keep it simple and functional without extra deps.

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Análise Inteligente de Pedidos</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">
          {/* Simulating Markdown rendering with whitespace-pre-wrap which handles basic formatting well enough for text blocks */}
          {content}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};