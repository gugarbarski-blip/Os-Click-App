import { createClient } from '@supabase/supabase-js';
import { ServiceOrder, OrderStatus, DeliveryMethod } from '../types';

// Configuração do Supabase
// Para usar o banco de dados real, você precisará definir essas variáveis de ambiente.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

/**
 * Serviço Híbrido de Dados
 * Se as chaves do Supabase existirem, usa o Banco de Dados.
 * Caso contrário, usa o LocalStorage do navegador.
 */
export const orderService = {
  
  // Listar Pedidos
  async getAll(): Promise<ServiceOrder[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('deadline', { ascending: true });
      
      if (error) {
        console.error("Erro Supabase:", error);
        throw error;
      }
      
      // Adapter: Converte formato do Banco (snake_case) para o App (camelCase)
      return data.map((row: any) => ({
        id: row.id,
        osNumber: row.os_number,
        storeName: row.store_name,
        salesperson: row.salesperson,
        deadline: row.deadline,
        deliveryMethod: row.delivery_method as DeliveryMethod,
        status: row.status as OrderStatus,
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
        notes: row.notes
      }));
    }
    
    // Fallback LocalStorage
    const local = localStorage.getItem('os_orders');
    return local ? JSON.parse(local) : [];
  },

  // Adicionar Pedido
  async add(order: ServiceOrder): Promise<void> {
    if (supabase) {
       const dbOrder = {
         id: order.id,
         os_number: order.osNumber,
         store_name: order.storeName,
         salesperson: order.salesperson,
         deadline: order.deadline,
         delivery_method: order.deliveryMethod,
         status: order.status,
         created_at: new Date(order.createdAt).toISOString(),
         notes: order.notes
       };
       const { error } = await supabase.from('orders').insert([dbOrder]);
       if (error) throw error;
       return;
    }
    
    // Fallback LocalStorage
    const orders = await this.getAll();
    orders.push(order);
    localStorage.setItem('os_orders', JSON.stringify(orders));
  },

  // Atualizar Status (Finalizar)
  async updateStatus(id: string, status: OrderStatus): Promise<void> {
     if (supabase) {
       const { error } = await supabase
         .from('orders')
         .update({ status })
         .eq('id', id);
       if (error) throw error;
       return;
     }

     // Fallback LocalStorage
     const orders = await this.getAll();
     const updated = orders.map(o => o.id === id ? { ...o, status } : o);
     localStorage.setItem('os_orders', JSON.stringify(updated));
  },
  
  // Deletar Pedido
  async delete(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    // Fallback LocalStorage
    const orders = await this.getAll();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem('os_orders', JSON.stringify(filtered));
  }
};