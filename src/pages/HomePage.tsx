import { Hero } from '../components/Hero';
import { BrandStrip } from '../components/BrandStrip';
import { Inventory } from '../components/Inventory';
import { PaymentCalculator } from '../components/PaymentCalculator';
import { TradeIn } from '../components/TradeIn';
import { Process } from '../components/Process';
import { Service } from '../components/Service';
import { Reviews } from '../components/Reviews';
import { HomeContact } from '../components/HomeContact';
import { FinalCTA } from '../components/FinalCTA';

export function HomePage() {
  const scrollToInventory = () => {
    document.querySelector('#inventory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onSearch={scrollToInventory} />
      <BrandStrip />
      <Inventory />
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
