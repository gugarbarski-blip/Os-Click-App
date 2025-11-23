export enum DeliveryMethod {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  storeName: string;
  salesperson: string;
  deadline: string; // ISO Date string
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  createdAt: number;
  notes?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  urgent: number; // Orders due within 24h
}