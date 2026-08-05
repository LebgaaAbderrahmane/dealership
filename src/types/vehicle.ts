export const VEHICLE_TYPES = ['SUV', 'Sedan', 'Truck', 'EV', 'Coupe'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_MAKES = ['Aurora', 'Vantage', 'Nimbus', 'Ridgeback', 'Corsa', 'Meridian'] as const;
export type VehicleMake = (typeof VEHICLE_MAKES)[number];

export type VehicleBadge = 'New' | 'Certified Pre-Owned' | 'Pre-Owned';

export interface Vehicle {
  id: number;
  year: number;
  name: string;
  type: VehicleType;
  make: VehicleMake;
  price: number;
  monthly: number;
  miles: number;
  drivetrain: string;
  badge: VehicleBadge;
  image: string;
  transmission: string;
  fuel: string;
  color: string;
  mpg: number;
  features: string[];
  gallery: string[];
  stock: string;
  description: string;
}
