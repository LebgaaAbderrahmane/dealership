import { Router } from 'express';
import type { ResultSetHeader } from 'mysql2';
import { z } from 'zod';
import { pool } from '../db';

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(3).max(40).optional(),
  email: z.string().email().optional(),
  topic: z.string().min(1).max(120).optional(),
  message: z.string().min(1).max(5000),
});

const preQualifySchema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(3).max(40),
  income: z.coerce.number().nonnegative().optional(),
  preferredContact: z.string().max(40).optional(),
});

const serviceSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(3).max(40),
  year: z.coerce.number().int().min(1950).max(2100),
  vehicle: z.string().min(1).max(160),
  service: z.string().min(1).max(160),
  date: z.string().min(1).max(40),
  time: z.string().min(1).max(80),
});

const tradeInSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().min(3).max(40).optional(),
  year: z.coerce.number().int().min(1950).max(2100),
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(120),
  trim: z.string().max(80).optional(),
  mileage: z.coerce.number().nonnegative(),
  condition: z.string().min(1).max(40),
  offer: z.coerce.number().nonnegative(),
});

const schemas: Record<string, z.ZodType> = {
  contact: contactSchema,
  'pre-qualify': preQualifySchema,
  service: serviceSchema,
  'trade-in': tradeInSchema,
};

export const leadsRouter = Router();

leadsRouter.post('/', async (req, res, next) => {
  try {
    const kind = String(req.body?.kind ?? '');
    const schema = schemas[kind];
    if (!schema) {
      res.status(400).json({ error: `Unsupported lead kind '${kind}'` });
      return;
    }
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const data = parsed.data as Record<string, unknown>;
    const name =
      String(data.name ?? '') ||
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      'Anonymous';
    const phone = String(data.phone ?? '') || null;
    const email = String(data.email ?? '') || null;
    const notes =
      kind === 'contact'
        ? [data.topic, data.message].filter(Boolean).join(' — ')
        : kind === 'service'
          ? `${data.service} on ${data.date} at ${data.time} (${data.year} ${data.vehicle})`
          : null;
    const payload = JSON.stringify(data);

    const [result] = await pool.query(
      `INSERT INTO leads (kind, name, phone, email, notes, payload) VALUES (?, ?, ?, ?, ?, ?)`,
      [kind, name, phone, email, notes, payload],
    );
    const insertId = Number((result as ResultSetHeader).insertId);
    res.status(201).json({ ok: true, id: insertId });
  } catch (err) {
    next(err);
  }
});
