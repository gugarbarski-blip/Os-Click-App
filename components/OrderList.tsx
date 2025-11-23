import React from 'react';
import { CheckCircle2, Clock, MapPin, Package, User, Calendar, AlertCircle, StickyNote } from 'lucide-react';
import { ServiceOrder, OrderStatus, DeliveryMethod } from '../types';

interface OrderListProps {
  orders: ServiceOrder[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onComplete, onDelete }) => {
  // Helper to calculate urgency
  const getUrgencyClass = (deadline: string) => {
    const now = new Date().getTime();
    const due = new Date(deadline).getTime();
    const diffHours = (due - now) / (1000 * 60 * 60);

    if (diffHours < 0) return 'border-red-500 bg-red-50'; // Late
    if (diffHours < 24) return 'border-orange-400 bg-orange-50'; // Urgent
    return 'border-slate-200 bg-white'; // Normal
  };

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">Nenhum pedido encontrado</h3>
        <p className="text-slate-500">Adicione uma nova OS para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {orders.map((order) => {
        const isCompleted = order.status === OrderStatus.COMPLETED;
        const urgencyClass = isCompleted ? 'border-emerald-200 bg-emerald-50/50' : getUrgencyClass(order.deadline);
        
        return (
          <div
            key={order.id}
            className={`relative rounded-xl border p-5 transition-all hover:shadow-md flex flex-col ${urgencyClass}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">OS #{order.osNumber}</span>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{order.storeName}</h3>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center ${
                order.deliveryMethod === DeliveryMethod.DELIVERY ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {order.deliveryMethod === DeliveryMethod.DELIVERY ? (
                  <><MapPin className="w-3 h-3 mr-1" /> Entrega</>
                ) : (
                  <><Package className="w-3 h-3 mr-1" /> Retirada</>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4 flex-grow">
              <div className="flex items-center text-sm text-slate-600">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                <span className="truncate">{order.salesperson || 'Vendedor N/A'}</span>
              </div>
              <div className={`flex items-center text-sm font-medium ${isCompleted ? 'text-slate-500' : 'text-slate-700'}`}>
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <span>{formatDeadline(order.deadline)}</span>
                {!isCompleted && new Date(order.deadline) < new Date() && (
                   <span className="ml-auto text-xs font-bold text-red-600 flex items-center">
                     <AlertCircle className="w-3 h-3 mr-1" /> ATRASADO
                   </span>
                )}
              </div>
              
              {/* Render Observations if they exist */}
              {order.notes && (
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <div className="flex items-start text-xs text-slate-600 bg-white/60 p-2 rounded-md border border-slate-100">
                    <StickyNote className="w-3 h-3 mr-1.5 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span className="italic">{order.notes}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between mt-auto">
              {isCompleted ? (
                <div className="flex items-center text-emerald-600 font-bold text-sm w-full justify-center py-2 bg-emerald-100/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Entregue
                </div>
              ) : (
                <button
                  onClick={() => onComplete(order.id)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalizar OS
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};