import { Fragment, useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { adminToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { ORDER_STATUSES, STATUS_BADGE, type Order, type OrderStatus } from '@/types/order';
import { cn, formatNumber } from '@/lib/utils';

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<{ orders: Order[] }>('/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken()}` },
      });
      setOrders(res.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: number, status: OrderStatus) => {
    try {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken()}` },
        body: JSON.stringify({ status }),
      });
      toast.success('Order status updated');
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!orders) {
    return <p className="text-sm text-muted-foreground">Loading orders…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{orders.length} orders in queue</p>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Finance</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet — buyers checking out on the site land here.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {order.vehicle_image && (
                        <img src={order.vehicle_image} alt="" className="h-10 w-14 rounded object-cover" />
                      )}
                      <div>
                        <p className="font-medium">#{order.id} · {order.vehicle_name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${formatNumber(order.vehicle_price)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={order.finance === 'financing' ? 'secondary' : 'outline'}>
                      {order.finance === 'financing' ? `Financing · ${formatNumber(order.down_payment ?? 0)} down · ${order.term_months}mo` : 'Cash'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
                      <select
                        className={selectClass}
                        value={order.status}
                        onChange={(e) => void setStatus(order.id, e.target.value as OrderStatus)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      aria-label={`Order ${order.id} details`}
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', expanded === order.id && 'rotate-180')} />
                    </Button>
                  </td>
                </tr>
                {expanded === order.id && (
                  <tr key={`${order.id}-details`} className="bg-muted/30">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                        <p className="mt-0.5">{order.notes || 'No notes.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
