import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { AIModal } from './components/AIModal';
import { ServiceOrder, OrderStatus, DashboardStats } from './types';
import { analyzeOrders } from './services/geminiService';
import { orderService } from './services/orderService';
import { PieChart, ListFilter, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // State for orders
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // State for filter
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

  // State for AI
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoadingData(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Add Order
  const addOrder = async (data: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: ServiceOrder = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: OrderStatus.PENDING,
    };
    
    // Optimistic update
    setOrders((prev) => [...prev, newOrder]);
    
    try {
      await orderService.add(newOrder);
    } catch (error) {
      console.error("Failed to save order", error);
      // Revert on failure if needed, but simplified for now
    }
  };

  // Complete Order
  const completeOrder = async (id: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: OrderStatus.COMPLETED } : order
      )
    );

    try {
      await orderService.updateStatus(id, OrderStatus.COMPLETED);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Delete Order
  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      await orderService.delete(id);
    } catch (error) {
      console.error("Failed to delete order", error);
    }
  };

  // Generate Report
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const result = await analyzeOrders(orders);
    setAiResult(result);
    setIsGenerating(false);
    setIsModalOpen(true);
  };

  // Derived Stats
  const stats: DashboardStats = useMemo(() => {
    const now = new Date().getTime();
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
      completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
      urgent: orders.filter(
        (o) =>
          o.status === OrderStatus.PENDING &&
          new Date(o.deadline).getTime() - now < 24 * 60 * 60 * 1000 &&
          new Date(o.deadline).getTime() > now
      ).length,
    };
  }, [orders]);

  // Filter and Sort Logic
  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (filter === 'PENDING') {
      result = result.filter(o => o.status === OrderStatus.PENDING);
    } else if (filter === 'COMPLETED') {
      result = result.filter(o => o.status === OrderStatus.COMPLETED);
    }

    // Sort: Completed last. For pending, closest deadline first.
    return result.sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === OrderStatus.PENDING ? -1 : 1;
        }
        // Both pending or both completed
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [orders, filter]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header onGenerateReport={handleGenerateReport} isGenerating={isGenerating} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-medium uppercase">Total Pedidos</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-blue-500 text-xs font-medium uppercase">Pendentes</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-orange-500 text-xs font-medium uppercase">Urgentes (24h)</p>
            <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-emerald-500 text-xs font-medium uppercase">Finalizados</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
        </div>

        <OrderForm onSubmit={addOrder} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <ListFilter className="w-5 h-5 mr-2 text-slate-500" />
            Lista de Pedidos
          </h2>
          
          <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
             <button 
               onClick={() => setFilter('ALL')}
               className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Todos
             </button>
             <button 
               onClick={() => setFilter('PENDING')}
               className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'PENDING' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Pendentes
             </button>
             <button 
               onClick={() => setFilter('COMPLETED')}
               className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Finalizados
             </button>
          </div>
        </div>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <p>Carregando pedidos...</p>
          </div>
        ) : (
          <OrderList orders={filteredOrders} onComplete={completeOrder} onDelete={deleteOrder} />
        )}
      </main>

      <AIModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        content={aiResult || ''} 
      />
    </div>
  );
};

export default App;