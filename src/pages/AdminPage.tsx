import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { adminToken, useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import type { Vehicle } from '@/types/vehicle';
import { VEHICLE_TYPES, VEHICLE_MAKES } from '@/types/vehicle';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Label } from '@/components/shadcn/label';
import { Badge } from '@/components/shadcn/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { formatNumber } from '@/lib/utils';

type Tab = 'vehicles' | 'leads';

interface Lead {
  id: number;
  kind: 'contact' | 'pre-qualify' | 'service' | 'trade-in';
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  payload: string | null;
  status: 'new' | 'contacted' | 'done';
  created_at: string;
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${adminToken()}` };
}

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

const KIND_LABEL: Record<Lead['kind'], string> = {
  contact: 'Contact',
  'pre-qualify': 'Pre-qualify',
  service: 'Service',
  'trade-in': 'Trade-in',
};

const STATUS_BADGE: Record<Lead['status'], 'secondary' | 'default' | 'success'> = {
  new: 'default',
  contacted: 'secondary',
  done: 'success',
};

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

interface VehicleDraft {
  year: number;
  name: string;
  type: string;
  make: string;
  price: number;
  monthly: number;
  miles: number;
  drivetrain: string;
  badge: string;
  image: string;
  transmission: string;
  fuel: string;
  color: string;
  mpg: number;
  stock: string;
  description: string;
  features: string;
  gallery: string;
}

const EMPTY_DRAFT: VehicleDraft = {
  year: new Date().getFullYear(),
  name: '',
  type: 'SUV',
  make: 'Aurora',
  price: 0,
  monthly: 0,
  miles: 0,
  drivetrain: 'AWD',
  badge: 'New',
  image: '',
  transmission: 'Automatic',
  fuel: 'Gasoline',
  color: '',
  mpg: 0,
  stock: '',
  description: '',
  features: '',
  gallery: '',
};

function fromVehicle(v: Vehicle): VehicleDraft {
  return {
    year: v.year,
    name: v.name,
    type: v.type,
    make: v.make,
    price: v.price,
    monthly: v.monthly,
    miles: v.miles,
    drivetrain: v.drivetrain,
    badge: v.badge,
    image: v.image,
    transmission: v.transmission,
    fuel: v.fuel,
    color: v.color,
    mpg: v.mpg,
    stock: v.stock,
    description: v.description,
    features: v.features.join(', '),
    gallery: v.gallery.join(', '),
  };
}

function toPayload(d: VehicleDraft) {
  return {
    ...d,
    features: d.features.split(',').map((s) => s.trim()).filter(Boolean),
    gallery: d.gallery.split(',').map((s) => s.trim()).filter(Boolean),
  };
}

function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<VehicleDraft>(vehicle ? fromVehicle(vehicle) : EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(vehicle ? fromVehicle(vehicle) : EMPTY_DRAFT);
      setError(null);
    }
  }, [open, vehicle]);

  const set = (key: keyof VehicleDraft, value: string | number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const path = vehicle ? `/admin/vehicles/${vehicle.id}` : '/admin/vehicles';
      await apiFetch(path, {
        method: vehicle ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(toPayload(draft)),
      });
      toast.success(vehicle ? 'Vehicle updated' : 'Vehicle added');
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit vehicle' : 'Add vehicle'}</DialogTitle>
          <DialogDescription>
            Prices are stored in USD — the site renders them in DZD.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vf-name">Name</Label>
            <Input id="vf-name" required value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-year">Year</Label>
            <Input id="vf-year" required type="number" value={draft.year} onChange={(e) => set('year', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-make">Make</Label>
            <select id="vf-make" className={selectClass} value={draft.make} onChange={(e) => set('make', e.target.value)}>
              {VEHICLE_MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-type">Type</Label>
            <select id="vf-type" className={selectClass} value={draft.type} onChange={(e) => set('type', e.target.value)}>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-badge">Badge</Label>
            <select id="vf-badge" className={selectClass} value={draft.badge} onChange={(e) => set('badge', e.target.value)}>
              <option>New</option>
              <option>Certified Pre-Owned</option>
              <option>Pre-Owned</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-stock">Stock #</Label>
            <Input id="vf-stock" required value={draft.stock} onChange={(e) => set('stock', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-price">Price (USD)</Label>
            <Input id="vf-price" required type="number" step="0.01" value={draft.price} onChange={(e) => set('price', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-monthly">Monthly (USD)</Label>
            <Input id="vf-monthly" required type="number" step="0.01" value={draft.monthly} onChange={(e) => set('monthly', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-miles">Miles</Label>
            <Input id="vf-miles" required type="number" value={draft.miles} onChange={(e) => set('miles', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-mpg">MPG</Label>
            <Input id="vf-mpg" required type="number" step="0.1" value={draft.mpg} onChange={(e) => set('mpg', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-drivetrain">Drivetrain</Label>
            <Input id="vf-drivetrain" required value={draft.drivetrain} onChange={(e) => set('drivetrain', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-transmission">Transmission</Label>
            <Input id="vf-transmission" required value={draft.transmission} onChange={(e) => set('transmission', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-fuel">Fuel</Label>
            <Input id="vf-fuel" required value={draft.fuel} onChange={(e) => set('fuel', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vf-color">Color</Label>
            <Input id="vf-color" required value={draft.color} onChange={(e) => set('color', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vf-image">Image URL</Label>
            <Input id="vf-image" required value={draft.image} onChange={(e) => set('image', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vf-gallery">Gallery URLs (comma separated)</Label>
            <Input id="vf-gallery" value={draft.gallery} onChange={(e) => set('gallery', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vf-features">Features (comma separated)</Label>
            <Input id="vf-features" value={draft.features} onChange={(e) => set('features', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vf-description">Description</Label>
            <Textarea id="vf-description" rows={3} value={draft.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : vehicle ? 'Save changes' : 'Add vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function VehiclesTab() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<{ vehicles: Vehicle[] }>('/admin/vehicles', {
        headers: authHeaders(),
      });
      setVehicles(res.vehicles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (v: Vehicle) => {
    if (!window.confirm(`Delete "${v.name}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/admin/vehicles/${v.id}`, { method: 'DELETE', headers: authHeaders() });
      toast.success('Vehicle deleted');
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!vehicles) {
    return <p className="text-sm text-muted-foreground">Loading vehicles…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{vehicles.length} vehicles in inventory</p>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus /> Add vehicle
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={v.image} alt={v.name} className="h-10 w-14 rounded object-cover" />
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.year} · {v.make} · {formatNumber(v.miles)} mi
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{v.type}</Badge>
                </td>
                <td className="px-4 py-3 tabular-nums">${formatNumber(v.price)}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{v.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(v);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => void handleDelete(v)}>
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <VehicleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={editing}
        onSaved={() => void load()}
      />
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<{ leads: Lead[] }>('/admin/leads', {
        headers: authHeaders(),
      });
      setLeads(res.leads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: number, status: Lead['status']) => {
    try {
      await apiFetch(`/admin/leads/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      toast.success('Lead status updated');
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!leads) {
    return <p className="text-sm text-muted-foreground">Loading leads…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Kind</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Notes</th>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                No leads yet — submissions from the contact, financing, service, and trade-in forms land here.
              </td>
            </tr>
          )}
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top hover:bg-muted/50">
              <td className="px-4 py-3 tabular-nums text-muted-foreground">{lead.id}</td>
              <td className="px-4 py-3">
                <Badge variant="secondary">{KIND_LABEL[lead.kind]}</Badge>
              </td>
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {lead.email && <span className="block">{lead.email}</span>}
                {lead.phone && <span className="block">{lead.phone}</span>}
              </td>
              <td className="max-w-xs px-4 py-3 text-muted-foreground">{lead.notes || '—'}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_BADGE[lead.status]}>{lead.status}</Badge>
                  <select
                    className={selectClass}
                    value={lead.status}
                    onChange={(e) => void setStatus(lead.id, e.target.value as Lead['status'])}
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="done">done</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminPage() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('vehicles');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold tracking-tight">Apex Admin</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => setTab('vehicles')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  tab === 'vehicles' ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Vehicles
              </button>
              <button
                onClick={() => setTab('leads')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  tab === 'leads' ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Leads
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{admin?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === 'vehicles' ? <VehiclesTab /> : <LeadsTab />}
      </main>
    </div>
  );
}
