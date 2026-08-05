import { Router } from 'express';
import type { ResultSetHeader } from 'mysql2';
import { z } from 'zod';
import { pool, query } from '../db';
import { requireAuth } from '../middleware/auth';

const vehicleSchema = z.object({
  year: z.coerce.number().int().min(1950).max(2100),
  name: z.string().min(1).max(120),
  type: z.string().min(1).max(30),
  make: z.string().min(1).max(50),
  price: z.coerce.number().nonnegative(),
  monthly: z.coerce.number().nonnegative(),
  miles: z.coerce.number().nonnegative(),
  drivetrain: z.string().min(1).max(40),
  badge: z.string().min(1).max(40),
  image: z.string().url().or(z.string().min(1)),
  transmission: z.string().min(1).max(40),
  fuel: z.string().min(1).max(40),
  color: z.string().min(1).max(60),
  mpg: z.coerce.number().nonnegative(),
  features: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  stock: z.string().min(1).max(20),
  description: z.string().max(5000).default(''),
});

const leadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'done']),
});

export const adminRouter = Router();
adminRouter.use(requireAuth);

adminRouter.get('/vehicles', async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT id, year, name, type, make, price, monthly, miles, drivetrain, badge, image,
              transmission, fuel, color, mpg, features, gallery, stock, description
       FROM vehicles ORDER BY name, year`,
    );
    res.json({ vehicles: rows });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/vehicles', async (req, res, next) => {
  try {
    const parsed = vehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
      return;
    }
    const v = parsed.data;
    const [result] = await pool.query(
      `INSERT INTO vehicles
         (year, name, type, make, price, monthly, miles, drivetrain, badge, image,
          transmission, fuel, color, mpg, features, gallery, stock, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.year, v.name, v.type, v.make, v.price, v.monthly, v.miles, v.drivetrain, v.badge, v.image,
        v.transmission, v.fuel, v.color, v.mpg,
        JSON.stringify(v.features), JSON.stringify(v.gallery), v.stock, v.description,
      ],
    );
    const id = Number((result as ResultSetHeader).insertId);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/vehicles/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid vehicle id' });
      return;
    }
    const parsed = vehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
      return;
    }
    const v = parsed.data;
    const [result] = await pool.query(
      `UPDATE vehicles SET
         year = ?, name = ?, type = ?, make = ?, price = ?, monthly = ?, miles = ?,
         drivetrain = ?, badge = ?, image = ?, transmission = ?, fuel = ?, color = ?,
         mpg = ?, features = ?, gallery = ?, stock = ?, description = ?
       WHERE id = ?`,
      [
        v.year, v.name, v.type, v.make, v.price, v.monthly, v.miles, v.drivetrain, v.badge, v.image,
        v.transmission, v.fuel, v.color, v.mpg,
        JSON.stringify(v.features), JSON.stringify(v.gallery), v.stock, v.description,
        id,
      ],
    );
    if (Number((result as ResultSetHeader).affectedRows) === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.json({ ok: true, id });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/vehicles/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid vehicle id' });
      return;
    }
    await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/leads', async (req, res, next) => {
  try {
    const kind = typeof req.query.kind === 'string' && req.query.kind ? req.query.kind : null;
    const status = typeof req.query.status === 'string' && req.query.status ? req.query.status : null;
    const where: string[] = [];
    const params: unknown[] = [];
    if (kind) {
      where.push('kind = ?');
      params.push(kind);
    }
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await query(
      `SELECT id, kind, name, phone, email, notes, payload, status, created_at
       FROM leads ${whereSql} ORDER BY created_at DESC LIMIT 500`,
      params,
    );
    res.json({ leads: rows });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/leads/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid lead id' });
      return;
    }
    const parsed = leadStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    const [result] = await pool.query('UPDATE leads SET status = ? WHERE id = ?', [parsed.data.status, id]);
    if (Number((result as ResultSetHeader).affectedRows) === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ ok: true, id });
  } catch (err) {
    next(err);
  }
});
