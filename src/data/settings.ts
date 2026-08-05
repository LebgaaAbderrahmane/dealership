export interface DealerSettings {
  name: string;
  phone: string;
  phoneHref: string;
  salesEmail: string;
  serviceEmail: string;
  addressLine1: string;
  addressLine2: string;
  license: string;
}

export interface HoursSettings {
  sales: string;
  service: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface TrustItem {
  label: string;
  sub: string;
}

export interface SocialSettings {
  instagram: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
}

export interface SiteSettings {
  dealer: DealerSettings;
  hours: HoursSettings;
  hero: {
    eyebrow: string;
    subline: string;
    stats: HeroStat[];
  };
  trust: TrustItem[];
  social: SocialSettings;
  footer: {
    blurb: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  dealer: {
    name: 'Apex Motors',
    phone: '+213 796 26 93 01',
    phoneHref: 'tel:+213796269301',
    salesEmail: 'sales@apexmotors.dz',
    serviceEmail: 'service@apexmotors.dz',
    addressLine1: 'Bordj El Kiffan',
    addressLine2: 'Algiers, Algeria',
    license: 'DL-0448210',
  },
  hours: {
    sales: 'Mon–Sat 9am–8pm · Sun 11am–6pm',
    service: 'Mon–Fri 7am–6pm · Sat 8am–4pm · Sun closed',
  },
  hero: {
    eyebrow: 'Bordj El Kiffan, Algiers · 340 vehicles in stock · Open 7 days',
    subline:
      'New and certified pre-owned across twelve makes, with transparent pricing and no four-hour finance office marathon.',
    stats: [
      { value: '340+', label: 'Vehicles in stock' },
      { value: '12', label: 'Premium makes' },
      { value: '172', label: 'Point inspection' },
      { value: '4.8★', label: 'Buyer rating' },
    ],
  },
  trust: [
    { label: 'No-haggle pricing', sub: 'The price online is the price you pay.' },
    { label: '7-day return policy', sub: 'Drive it, and still change your mind.' },
    { label: '172-point inspection', sub: 'Every vehicle, certified before sale.' },
    { label: '4.8★ from 2,100+ reviews', sub: 'Rated by real buyers in Algiers.' },
  ],
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    whatsapp: '',
  },
  footer: {
    blurb:
      'New & certified pre-owned · Bordj El Kiffan, Algiers. Transparent pricing, honest trade-ins, and zero finance-office games.',
  },
};
