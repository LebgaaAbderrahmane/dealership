import { Router } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { pool } from '../db';

const orderSchema = z.object({
  vehicleId: z.coerce.number().int().positive(),
  name: z.string().min(1).max(120),
  phone: z.string().min(3).max(40),
  email: z.string().email().max(160),
  finance: z.enum(['cash', 'financing']).default('cash'),
  downPayment: z.coerce.number().int().nonnegative().max(10000000).optional(),
  term: z.coerce.number().int().min(12).max(96).optional(),
  tradeIn: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export const ordersRouter = Router();

ordersRouter.post('/', async (req, res, next) => {
  try {
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
      return;
    }
    const data = parsed.data;

    const [vehicleRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, price, image FROM vehicles WHERE id = ?',
      [data.vehicleId],
    );
    const vehicle = vehicleRows[0] as unknown as { id: number; name: string; price: number; image: string } | undefined;
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    const finance = data.finance;
    const downPayment = finance === 'financing' ? (data.downPayment ?? 0) : null;
    const term = finance === 'financing' ? (data.term ?? 60) : null;

    const [result] = await pool.query(
      `INSERT INTO orders
         (vehicle_id, vehicle_name, vehicle_price, vehicle_image,
          name, phone, email, finance, down_payment, term_months, trade_in, notes, payload)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle.id,
        vehicle.name,
        vehicle.price,
        vehicle.image,
        data.name,
        data.phone,
        data.email,
        finance,
        downPayment,
        term,
        data.tradeIn?.trim() ? data.tradeIn.trim() : null,
        data.notes?.trim() ? data.notes.trim() : null,
        JSON.stringify(data),
      ],
    );
    const id = Number((result as ResultSetHeader).insertId);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    next(err);
  }
});
