import { useState } from 'react';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { Inventory } from '../components/Inventory';
import { PaymentCalculator } from '../components/PaymentCalculator';
import { TradeIn } from '../components/TradeIn';
import { Process } from '../components/Process';
import { Service } from '../components/Service';
import { Reviews } from '../components/Reviews';
import { HomeContact } from '../components/HomeContact';
import { FinalCTA } from '../components/FinalCTA';
import { DEFAULT_FILTERS, type VehicleFilters } from '../lib/filters';

export function HomePage() {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS);

  const scrollToInventory = () => {
    document.querySelector('#inventory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onSearch={scrollToInventory} />
      <TrustStrip />
      <Inventory filters={filters} onFiltersChange={setFilters} />
      <PaymentCalculator />
      <TradeIn />
      <Process />
      <Service />
      <Reviews />
      <FinalCTA />
      <HomeContact />
    </>
  );
}
