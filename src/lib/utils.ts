import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DZD_PER_USD = 250;
const KM_PER_MILE = 1.609344;

export function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

export function formatPrice(n: number) {
  return `${formatNumber(Math.round(n * DZD_PER_USD))} DA`;
}

export function formatDistance(mi: number) {
  return `${formatNumber(Math.round(mi * KM_PER_MILE))} km`;
}
