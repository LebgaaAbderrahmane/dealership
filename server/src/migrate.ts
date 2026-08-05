import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { pool } from './db';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(30) NOT NULL,
  make VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  monthly INT NOT NULL,
  miles INT NOT NULL,
  drivetrain VARCHAR(40) NOT NULL,
  badge VARCHAR(40) NOT NULL,
  image VARCHAR(500) NOT NULL,
  transmission VARCHAR(40) NOT NULL,
  fuel VARCHAR(40) NOT NULL,
  color VARCHAR(60) NOT NULL,
  mpg INT NOT NULL DEFAULT 0,
  features JSON NOT NULL,
  gallery JSON NOT NULL,
  stock VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vehicles_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kind ENUM('contact', 'pre-qualify', 'service', 'trade-in') NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(160) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  payload JSON NOT NULL,
  status ENUM('new', 'contacted', 'done') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

interface SeedVehicle {
  id: number;
  year: number;
  name: string;
  type: string;
  make: string;
  price: number;
  monthly: number;
  miles: number;
  drivetrain: string;
  badge: string;
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

export async function migrate() {
  const conn = await pool.getConnection();
  try {
    for (const stmt of SCHEMA.split(';').filter((s) => s.trim())) {
      await conn.query(stmt);
    }
    console.log('Schema ready');

    const [vehiclesRows] = await conn.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS n FROM vehicles');
    const vehicleCount = Number(vehiclesRows[0].n);
    if (vehicleCount === 0) {
      const seedPath = path.resolve(process.cwd(), 'seed/vehicles.json');
      const vehicles: SeedVehicle[] = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      for (const v of vehicles) {
        await conn.query(
          `INSERT INTO vehicles
             (id, year, name, type, make, price, monthly, miles, drivetrain, badge, image,
              transmission, fuel, color, mpg, features, gallery, stock, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.id,
            v.year,
            v.name,
            v.type,
            v.make,
            v.price,
            v.monthly,
            v.miles,
            v.drivetrain,
            v.badge,
            v.image,
            v.transmission,
            v.fuel,
            v.color,
            v.mpg,
            JSON.stringify(v.features),
            JSON.stringify(v.gallery),
            v.stock,
            v.description,
          ],
        );
      }
      console.log(`Seeded ${vehicles.length} vehicles`);
    } else {
      console.log(`vehicles table already has ${vehicleCount} rows`);
    }

    const [adminRows] = await conn.query<mysql.RowDataPacket[]>(
      'SELECT COUNT(*) AS n FROM admins WHERE username = ?',
      [process.env.ADMIN_USERNAME ?? 'admin'],
    );
    if (Number(adminRows[0].n) === 0) {
      const username = process.env.ADMIN_USERNAME ?? 'admin';
      const password = process.env.ADMIN_PASSWORD ?? 'admin123';
      const hash = await bcrypt.hash(password, 10);
      await conn.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hash]);
      console.log(`Seeded admin '${username}' (password from ADMIN_PASSWORD env)`);
    } else {
      console.log('admin user already exists');
    }
  } finally {
    conn.release();
  }
}

const isMain = Boolean(process.argv[1] && import.meta.url.endsWith(process.argv[1]));
if (isMain) {
  migrate()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
