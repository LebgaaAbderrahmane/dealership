import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Car, Inbox, Plus, Settings, ShoppingCart } from 'lucide-react';
import { adminToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/shadcn/button';
import { Badge } from '@/components/shadcn/badge';
import { cn, formatNumber } from '@/lib/utils';

export type AdminTab = 'dashboard' | 'vehicles' | 'leads' | 'settings' | 'orders';

interface Stats {
  vehicles: { total: number };
  leads: { total: number; new: number; contacted: number; done: number; byKind: Record<string, number> };
  orders: { total: number; new: number; contacted: number; closed: number; cancelled: number };
  recent: { id: number; kind: string; name: string; status: string; created_at: string }[];
  recentOrders: { id: number; vehicle_name: string; vehicle_price: number; name: string; status: string; created_at: string }[];
}

const KIND_LABEL: Record<string, string> = {
  contact: 'Contact',
  'pre-qualify': 'Pre-qualify',
  service: 'Service',
  'trade-in': 'Trade-in',
};

const STATUS_BADGE: Record<string, 'default' | 'secondary' | 'success'> = {
  new: 'default',
  contacted: 'secondary',
  done: 'success',
};

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn('mt-2 font-display text-3xl font-bold tabular-nums', accent ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
    </div>
  );
}

export function DashboardTab({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<Stats>('/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken()}` },
      });
      setStats(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const kindEntries = Object.entries(stats?.leads.byKind ?? {});
  const maxKind = Math.max(1, ...kindEntries.map(([, n]) => n));

  return (
    <div className="space-y-8">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : !stats ? (
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Overview</h2>
            <p className="text-sm text-muted-foreground">
              A snapshot of inventory and incoming leads.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-7">
            <StatCard label="Vehicles" value={formatNumber(stats.vehicles.total)} />
            <StatCard label="Orders" value={formatNumber(stats.orders.total)} accent />
            <StatCard label="New orders" value={formatNumber(stats.orders.new)} />
            <StatCard label="Total leads" value={formatNumber(stats.leads.total)} />
            <StatCard label="New leads" value={formatNumber(stats.leads.new)} />
            <StatCard label="Contacted" value={formatNumber(stats.leads.contacted)} />
            <StatCard label="Done" value={formatNumber(stats.leads.done)} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="text-sm font-semibold">Leads by type</h3>
              {kindEntries.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No leads yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {kindEntries.map(([kind, n]) => (
                    <div key={kind}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{KIND_LABEL[kind] ?? kind}</span>
                        <span className="font-semibold tabular-nums">{n}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(n / maxKind) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-card p-5">
              <h3 className="text-sm font-semibold">Quick actions</h3>
              <div className="mt-4 grid gap-2">
                <Button variant="outline" className="justify-start" onClick={() => onNavigate('vehicles')}>
                  <Plus /> Add a vehicle
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => onNavigate('orders')}>
                  <ShoppingCart /> Review orders
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => onNavigate('leads')}>
                  <Inbox /> Review leads
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => onNavigate('settings')}>
                  <Settings /> Edit site settings
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Recent leads</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No leads yet — submissions land here.
                    </td>
                  </tr>
                )}
                {stats.recent.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{KIND_LABEL[lead.kind] ?? lead.kind}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[lead.status] ?? 'secondary'}>{lead.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('leads')}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`View lead ${lead.id}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Recent orders</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No orders yet — buyers checking out land here.
                    </td>
                  </tr>
                )}
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">#{order.id} · {order.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.vehicle_name} · ${formatNumber(order.vehicle_price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[order.status] ?? 'secondary'}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('orders')}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`View order ${order.id}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Car className="h-4 w-4" />
        Inventory is served from the MySQL database — add or edit vehicles under Vehicles.
      </div>
    </div>
  );
}
