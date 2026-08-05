import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inventory } from '../src/data/inventory';

const out = resolve(process.cwd(), 'server/seed/vehicles.json');
writeFileSync(out, JSON.stringify(inventory, null, 2));
console.log(`Wrote ${inventory.length} vehicles to ${out}`);
