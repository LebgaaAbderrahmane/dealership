import {
  VEHICLE_TYPES,
  VEHICLE_MAKES,
  type VehicleType,
  type VehicleMake,
  type VehicleBadge,
  type Vehicle,
} from '../types/vehicle';

export { VEHICLE_TYPES, VEHICLE_MAKES };
export type { VehicleType, VehicleMake, VehicleBadge, Vehicle };

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTO_POOL = [
  '1503376780353-7e6692767b70',
  '1555215695-3004980ad54e',
  '1618843479313-40f8afb4b4d8',
  '1605559424843-9e4c228bf1c2',
  '1552519507-da3b142c6e3d',
  '1583121274602-3e2820c69888',
  '1553440569-bcc63803a83d',
  '1494976388531-d1058494cdd8',
  '1519641471654-76ce0107ad1b',
  '1493238792000-8113da705763',
  '1542362567-b07e54358753',
  '1533473359331-0135ef1b58bf',
  '1449965408869-eaa3f722e40d',
  '1607860108855-64acf2078ed9',
  '1502877338535-766e1452684a',
  '1549317661-bd32c8ce0db2',
  '1580273916550-e323be2ae537',
] as const;

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2400&auto=format&fit=crop';

export const TRADE_IN_IMAGE =
  'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1600&auto=format&fit=crop';

export const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop';

export const SERVICE_IMAGE =
  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2400&auto=format&fit=crop';

export const CONTACT_IMAGE =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2400&auto=format&fit=crop';

export const PRIVACY_IMAGE =
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2400&auto=format&fit=crop';

export const ACCESSIBILITY_IMAGE =
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2400&auto=format&fit=crop';

const TYPE_SPECS: Record<VehicleType, { drivetrain: string; fuel: string; transmission: string; mpg: number }> = {
  Sedan: { drivetrain: 'AWD', fuel: 'Gasoline', transmission: '8-Speed Auto', mpg: 28 },
  SUV: { drivetrain: 'AWD', fuel: 'Gasoline', transmission: '8-Speed Auto', mpg: 24 },
  Truck: { drivetrain: '4WD', fuel: 'Gasoline', transmission: '10-Speed Auto', mpg: 18 },
  EV: { drivetrain: 'RWD', fuel: 'Electric', transmission: 'Single-Speed', mpg: 0 },
  Coupe: { drivetrain: 'RWD', fuel: 'Gasoline', transmission: '8-Speed Auto', mpg: 26 },
};

const COLORS = ['Obsidian Black', 'Glacier White', 'Cobalt Blue', 'Graphite Grey', 'Silver Mist', 'Deep Red'];

const FEATURES = [
  'Heated & ventilated front seats',
  'Adaptive cruise control',
  'Wireless CarPlay & Android Auto',
  '360° surround-view camera',
  'Panoramic glass roof',
  'Lane-keeping assist',
  'Blind-spot monitoring',
  'Head-up display',
  'Premium audio system',
  'Heated steering wheel',
  'Power liftgate',
  'Forward collision warning',
  'Trailer hitch prep',
  'All-terrain tires',
  'Rapid charging capable',
  'Memory driver seat',
];

const DESC: Record<VehicleType, string> = {
  Sedan: 'A sharp, low-slung sedan with a refined interior, balanced ride, and everyday efficiency — inspected and detailed, ready for the highway.',
  SUV: 'Roomy three-row capability with composed handling, generous cargo space, and all the family tech you actually use.',
  Truck: 'Built for work and weekends, with a towing-ready chassis, rugged off-road hardware, and a cabin that stays quiet on the interstate.',
  EV: 'Instant torque, near-silent cruising, and fast-charging range that fits real commutes — with full battery health report in the glovebox.',
  Coupe: 'Two-door attitude with a taut chassis, quick steering, and an engine note worth the evening drive.',
};

const cur: Array<{ name: string; type: VehicleType; price: number; monthly: number; miles: number; year: number; badge: VehicleBadge }> = [
  { name: 'Aurora GT Line', type: 'Sedan', price: 42900, monthly: 612, miles: 12400, year: 2024, badge: 'Certified Pre-Owned' },
  { name: 'Vantage EX SUV', type: 'SUV', price: 36500, monthly: 521, miles: 21800, year: 2023, badge: 'Certified Pre-Owned' },
  { name: 'Nimbus EV Long Range', type: 'EV', price: 51200, monthly: 731, miles: 1200, year: 2025, badge: 'New' },
  { name: 'Ridgeback 4x4 Crew', type: 'Truck', price: 39750, monthly: 567, miles: 38600, year: 2022, badge: 'Certified Pre-Owned' },
  { name: 'Corsa Sport Coupe', type: 'Coupe', price: 47300, monthly: 675, miles: 8900, year: 2024, badge: 'Certified Pre-Owned' },
  { name: 'Meridian Touring', type: 'Sedan', price: 28400, monthly: 405, miles: 26100, year: 2023, badge: 'Certified Pre-Owned' },
  { name: 'Vantage Hybrid', type: 'SUV', price: 44900, monthly: 641, miles: 400, year: 2025, badge: 'New' },
  { name: 'Aurora Base', type: 'Sedan', price: 21900, monthly: 313, miles: 52300, year: 2021, badge: 'Pre-Owned' },
  { name: 'Ridgeback Trail Edition', type: 'Truck', price: 48600, monthly: 694, miles: 14700, year: 2024, badge: 'Certified Pre-Owned' },
  { name: 'Vantage Base SUV', type: 'SUV', price: 34000, monthly: 485, miles: 29400, year: 2022, badge: 'Pre-Owned' },
  { name: 'Nimbus EV Standard', type: 'EV', price: 42300, monthly: 604, miles: 5600, year: 2024, badge: 'Certified Pre-Owned' },
  { name: 'Corsa GT', type: 'Coupe', price: 32500, monthly: 464, miles: 31800, year: 2021, badge: 'Pre-Owned' },
];

const GENERATED: Array<{ name: string; type: VehicleType }> = [
  { name: 'Aurora Touring', type: 'Sedan' },
  { name: 'Aurora Sport', type: 'Coupe' },
  { name: 'Vantage X SUV', type: 'SUV' },
  { name: 'Vantage Trail SUV', type: 'SUV' },
  { name: 'Nimbus EV Base', type: 'EV' },
  { name: 'Nimbus EV Performance', type: 'EV' },
  { name: 'Ridgeback Workhorse', type: 'Truck' },
  { name: 'Ridgeback LT', type: 'Truck' },
  { name: 'Corsa Premium', type: 'Coupe' },
  { name: 'Meridian LX', type: 'Sedan' },
  { name: 'Meridian Sport', type: 'Sedan' },
  { name: 'Aurora Luxury', type: 'Sedan' },
  { name: 'Vantage Signature', type: 'SUV' },
  { name: 'Nimbus EV Touring', type: 'EV' },
  { name: 'Ridgeback King Cab', type: 'Truck' },
  { name: 'Corsa S', type: 'Coupe' },
  { name: 'Meridian Hybrid', type: 'Sedan' },
  { name: 'Aurora Executive', type: 'Sedan' },
  { name: 'Vantage AWD 7-Seat', type: 'SUV' },
  { name: 'Nimbus EV Sport', type: 'EV' },
  { name: 'Ridgeback 4x4 Off-Road', type: 'Truck' },
  { name: 'Corsa Track', type: 'Coupe' },
  { name: 'Meridian Standard', type: 'Sedan' },
  { name: 'Aurora XLE', type: 'Sedan' },
  { name: 'Vantage LE', type: 'SUV' },
  { name: 'Nimbus EV AWD', type: 'EV' },
  { name: 'Ridgeback Limited', type: 'Truck' },
  { name: 'Corsa R', type: 'Coupe' },
];

const priceFor = (i: number, base: number) => base + ((i * 1379) % 24000);

function buildVehicle(id: number, name: string, type: VehicleType, price: number, monthly: number, miles: number, make: VehicleMake, badge: VehicleBadge, year: number): Vehicle {
  const spec = TYPE_SPECS[type];
  const gallery = PHOTO_POOL.slice(id % 14, (id % 14) + 4).length >= 4
    ? PHOTO_POOL.slice(id % 14, (id % 14) + 4).map((p) => img(p, 1600))
    : [...PHOTO_POOL.slice(id % 14), ...PHOTO_POOL.slice(0, 4 - (PHOTO_POOL.length - (id % 14)))].map((p) => img(p, 1600));
  const featureCount = 6 + (id % 5);
  const features = Array.from(new Set(Array.from({ length: featureCount }, (_, k) => FEATURES[(id + k * 3) % FEATURES.length])));
  return {
    id,
    year,
    name,
    type,
    make,
    price,
    monthly,
    miles,
    drivetrain: spec.drivetrain,
    badge,
    image: img(PHOTO_POOL[id % PHOTO_POOL.length]),
    transmission: spec.transmission,
    fuel: type === 'EV' ? 'Electric' : spec.fuel,
    color: COLORS[id % COLORS.length],
    mpg: type === 'EV' ? 0 : spec.mpg + (id % 6),
    features,
    gallery,
    stock: `APX${10000 + id * 7}`,
    description: DESC[type],
  };
}

const curated: Vehicle[] = cur.map((c, i) =>
  buildVehicle(i + 1, c.name, c.type, c.price, c.monthly, c.miles, c.name.split(' ')[0] as VehicleMake, c.badge, c.year),
);

const generated: Vehicle[] = GENERATED.map((g, i) => {
  const id = cur.length + i + 1;
  const base = { Sedan: 26500, SUV: 34000, Truck: 38000, EV: 40000, Coupe: 33000 }[g.type];
  const price = priceFor(i, base);
  const monthly = Math.round((Math.max(price - 5000, 0) * (0.069 / 12)) / (1 - Math.pow(1 + 0.069 / 12, -60)));
  const miles = ((i * 6197) % 58000) + 800;
  const badge: VehicleBadge = i % 4 === 0 ? 'New' : i % 3 === 0 ? 'Pre-Owned' : 'Certified Pre-Owned';
  return buildVehicle(id, g.name, g.type, price, monthly, miles, g.name.split(' ')[0] as VehicleMake, badge, 2025 - (i % 4));
});

export const inventory: Vehicle[] = [...curated, ...generated];

export const VEHICLE_COUNT = inventory.length;

export function getVehicleById(id: number | string | undefined) {
  if (id === undefined) return undefined;
  const n = Number(id);
  return inventory.find((v) => v.id === n);
}

export function similarVehicles(vehicle: Vehicle, count = 3) {
  return inventory
    .filter((v) => v.id !== vehicle.id)
    .sort((a, b) => {
      const aScore = (a.type === vehicle.type ? 0 : 1) + (a.make === vehicle.make ? 0 : 1) + Math.abs(a.price - vehicle.price) / 10000;
      const bScore = (b.type === vehicle.type ? 0 : 1) + (b.make === vehicle.make ? 0 : 1) + Math.abs(b.price - vehicle.price) / 10000;
      return aScore - bScore;
    })
    .slice(0, count);
}
