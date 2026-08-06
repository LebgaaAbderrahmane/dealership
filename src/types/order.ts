export type OrderStatus = 'new' | 'contacted' | 'closed' | 'cancelled';

export type FinanceOption = 'cash' | 'financing';

export interface Order {
  id: number;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_price: number;
  vehicle_image: string | null;
  name: string;
  phone: string;
  email: string;
  finance: FinanceOption;
  down_payment: number | null;
  term_months: number | null;
  trade_in: string | null;
  notes: string | null;
  payload: string | null;
  status: OrderStatus;
  created_at: string;
}

export const ORDER_STATUSES: OrderStatus[] = ['new', 'contacted', 'closed', 'cancelled'];

export const STATUS_BADGE: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'destructive'> = {
  new: 'default',
  contacted: 'secondary',
  closed: 'success',
  cancelled: 'destructive',
};
