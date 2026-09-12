export const VEHICLE_TYPES = ['SUV', 'Sedan', 'Truck', 'EV', 'Coupe'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_MAKES = ['Honda', 'Toyota', 'BMW', 'Mazda', 'Hyundai', 'Ford', 'Chevrolet', 'Ram', 'Tesla', 'Subaru', 'Jeep', 'Porsche', 'Mercedes-Benz', 'Audi'] as const;
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
  engine: string;
  horsepower: number;
  torque: string;
  acceleration: string;
  topSpeed: string;
  seats: number;
  doors: number;
  cargoVolume: number;
  batteryCapacity?: string;
  range?: string;
  towingCapacity?: string;
  features: string[];
  gallery: string[];
  stock: string;
  description: string;
}
