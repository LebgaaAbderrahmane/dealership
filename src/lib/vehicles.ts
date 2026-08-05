import { useEffect, useState } from 'react';
import { apiFetch } from './api';
import { inventory, getVehicleById, similarVehicles, VEHICLE_COUNT, VEHICLE_MAKES, VEHICLE_TYPES } from '../data/inventory';
import type { Vehicle } from '../types/vehicle';

export interface VehicleQuery {
  type?: string;
  make?: string;
  maxPrice?: number;
  maxMonthly?: number;
  q?: string;
  sort?: string;
  limit?: number;
}

export interface VehiclePage {
  vehicles: Vehicle[];
  total: number;
  loading: boolean;
  error: boolean;
}

interface Meta {
  count: number;
  makes: string[];
  types: string[];
}

export function buildVehicleQueryParams(query: VehicleQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'type' && value === 'All') return;
    if ((key === 'maxPrice' && value === 90000) || (key === 'maxMonthly' && value === 10000)) return;
    params.set(key, String(value));
  });
  return params.toString();
}

function filterStatic(query: VehicleQuery): Vehicle[] {
  const q = (query.q ?? '').trim().toLowerCase();
  let list = inventory.filter(
    (v) =>
      (query.type === undefined || query.type === 'All' || v.type === query.type) &&
      (query.make === undefined || query.make === 'All' || v.make === query.make) &&
      v.price <= (query.maxPrice ?? 90000) &&
      v.monthly <= (query.maxMonthly ?? 10000) &&
      (!q || [v.name, v.make, v.type].some((s) => s.toLowerCase().includes(q))),
  );
  switch (query.sort) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'miles-asc':
      list = [...list].sort((a, b) => a.miles - b.miles);
      break;
    case 'monthly-asc':
      list = [...list].sort((a, b) => a.monthly - b.monthly);
      break;
  }
  return list.slice(0, query.limit ?? 9);
}

export function useVehicles(query: VehicleQuery): VehiclePage {
  const [state, setState] = useState<VehiclePage>({ vehicles: [], total: 0, loading: true, error: false });

  useEffect(() => {
    const params = buildVehicleQueryParams(query);
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true }));
    fetch(`/api/vehicles${params ? `?${params}` : ''}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API unavailable'))))
      .then((data: { vehicles: Vehicle[]; total: number }) =>
        setState({ vehicles: data.vehicles, total: data.total, loading: false, error: false }),
      )
      .catch((err: unknown) => {
        if ((err as Error).name === 'AbortError') return;
        const list = filterStatic(query);
        setState({ vehicles: list, total: list.length, loading: false, error: true });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildVehicleQueryParams(query)]);

  return state;
}

let metaCache: Promise<Meta> | null = null;

function loadMeta(): Promise<Meta> {
  if (!metaCache) {
    metaCache = apiFetch<Meta>('/vehicles/meta').catch(() => ({
      count: VEHICLE_COUNT,
      makes: [...VEHICLE_MAKES],
      types: [...VEHICLE_TYPES],
    }));
  }
  return metaCache;
}

export function useMeta(): Meta | null {
  const [meta, setMeta] = useState<Meta | null>(null);
  useEffect(() => {
    let active = true;
    loadMeta().then((m) => active && setMeta(m));
    return () => {
      active = false;
    };
  }, []);
  return meta;
}

export function useVehicle(id: string | undefined): { vehicle?: Vehicle; loading: boolean } {
  const [state, setState] = useState<{ vehicle?: Vehicle; loading: boolean }>({ loading: true });
  useEffect(() => {
    if (!id) return;
    setState({ loading: true });
    fetch(`/api/vehicles/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API unavailable'))))
      .then((vehicle: Vehicle) => setState({ vehicle, loading: false }))
      .catch(() => setState({ vehicle: getVehicleById(id), loading: false }));
  }, [id]);
  return state;
}

export function useSimilar(vehicle: Vehicle | undefined, limit = 3): Vehicle[] {
  const [list, setList] = useState<Vehicle[]>([]);
  useEffect(() => {
    if (!vehicle) return;
    fetch(`/api/vehicles/${vehicle.id}/similar?limit=${limit}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API unavailable'))))
      .then((data: { vehicles: Vehicle[] }) => setList(data.vehicles))
      .catch(() => setList(similarVehicles(vehicle, limit)));
  }, [vehicle, limit]);
  return list;
}
