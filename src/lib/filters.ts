export interface VehicleFilters {
  type: string;
  make: string;
  maxPrice: number;
  maxMonthly: number;
}

export const DEFAULT_FILTERS: VehicleFilters = {
  type: 'All',
  make: 'All',
  maxPrice: 90000,
  maxMonthly: 10000,
};
