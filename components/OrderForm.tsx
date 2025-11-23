import React, { useState } from 'react';
import { Plus, Truck, Store, Calendar, User, ShoppingBag, FileText, StickyNote } from 'lucide-react';
import { DeliveryMethod, ServiceOrder, OrderStatus } from '../types';

interface OrderFormProps {
  onSubmit: (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [osNumber, setOsNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.PICKUP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!osNumber || !storeName || !deadline) return;

    onSubmit({
      osNumber,
      storeName,
      salesperson,
      deadline,
      deliveryMethod,
      notes: notes.trim(),
    });

    // Reset form
    setOsNumber('');
    setStoreName('');
    setSalesperson('');
    setDeadline('');
    setNotes('');
    setDeliveryMethod(DeliveryMethod.PICKUP);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-blue-50 p-1.5 rounded-md">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Nova Ordem de Serviço</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* OS Number */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nº OS</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={osNumber}
              onChange={(e) => setOsNumber(e.target.value)}
              className="pl-10 w-full rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-slate-900 placeholder-slate-400"
              placeholder="00000"
            />
          </div>
        </div>

        {/* Store */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Loja</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShoppingBag className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="pl-10 w-full rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-slate-900 placeholder-slate-400"
              placeholder="Nome da Loja"
            />
          </div>
        </div>

        {/* Salesperson */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
              className="pl-10 w-full rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-slate-900 placeholder-slate-400"
              placeholder="Nome do Vendedor"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Prazo</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="pl-10 w-full rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm bg-white text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Notes - New Field */}
        <div className="lg:col-span-12">
          <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <StickyNote className="h-4 w-4 text-slate-400" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="pl-10 w-full rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none bg-white text-slate-900 placeholder-slate-400"
              placeholder="Detalhes adicionais sobre o pedido (ex: frágil, horário específico...)"
            />
          </div>
        </div>

        {/* Submit & Type */}
        <div className="lg:col-span-12 flex flex-col md:flex-row items-center gap-4 pt-2 border-t border-slate-100">
           <div className="flex rounded-lg bg-slate-100 p-1 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setDeliveryMethod(DeliveryMethod.PICKUP)}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                deliveryMethod === DeliveryMethod.PICKUP
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Store className="w-4 h-4 mr-2" /> Retirar
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod(DeliveryMethod.DELIVERY)}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                deliveryMethod === DeliveryMethod.DELIVERY
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center">
                 <Truck className="w-4 h-4 mr-2" /> Entrega
              </div>
            </button>
          </div>
          
          <div className="flex-grow"></div>

          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-white py-2.5 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors font-medium text-sm shadow-sm flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar OS
          </button>
        </div>
      </form>
    </div>
  );
};