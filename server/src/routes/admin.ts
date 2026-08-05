import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import sharp from 'sharp';
import { z } from 'zod';
import { pool, query } from '../db';
import { requireAuth } from '../middleware/auth';

const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'uploads');
const MAX_IMAGE_DIMENSION = 1920;
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, _file, cb) => cb(null, `uploading-${randomUUID()}`),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(png|jpe?g|webp|gif|avif|svg\+xml)$/;
    cb(null, allowed.test(file.mimetype));
  },
});

function uploadErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Image is too large (max 15 MB)' });
      return;
    }
    res.status(400).json({ error: `Upload failed: ${err.message}` });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
}

const UPLOAD_PATH_RE = /^\/uploads\/[^/]+$/;

function localUploadPaths(values: unknown[]): string[] {
  const names = new Set<string>();
  for (const value of values) {
    if (typeof value === 'string' && UPLOAD_PATH_RE.test(value)) {
      names.add(path.basename(value));
    }
  }
  return [...names];
}

async function deleteIfUnreferenced(basename: string, excludingId?: number) {
  const where = excludingId === undefined ? 'WHERE image = ? OR JSON_CONTAINS(gallery, JSON_QUOTE(?))' : 'WHERE id <> ? AND (image = ? OR JSON_CONTAINS(gallery, JSON_QUOTE(?)))';
  const params: unknown[] = excludingId === undefined ? [`/uploads/${basename}`, `/uploads/${basename}`] : [excludingId, `/uploads/${basename}`, `/uploads/${basename}`];
  const rows = await query(`SELECT 1 FROM vehicles ${where} LIMIT 1`, params);
  if ((rows as unknown[]).length === 0) {
    await unlink(path.join(uploadsDir, basename)).catch(() => undefined);
  }
}

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

adminRouter.post('/upload', upload.single('image'), uploadErrorHandler, async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'Upload a valid image file (png, jpg, webp, gif, avif, svg)' });
    return;
  }
  const tempPath = path.join(uploadsDir, file.filename);
  try {
    if (file.mimetype === 'image/svg+xml') {
      const finalName = `${randomUUID()}.svg`;
      await rename(tempPath, path.join(uploadsDir, finalName));
      res.status(201).json({ url: `/uploads/${finalName}` });
      return;
    }
    const finalName = `${randomUUID()}.webp`;
    await sharp(tempPath)
      .resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(uploadsDir, finalName));
    res.status(201).json({ url: `/uploads/${finalName}` });
  } catch (err) {
    console.error('image processing failed', err);
    res.status(400).json({ error: 'Could not process the image' });
  } finally {
    await unlink(tempPath).catch(() => undefined);
  }
});

adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [vehicleRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS n FROM vehicles',
    );
    const [leadAgg] = await pool.query<RowDataPacket[]>(
      `SELECT
         COUNT(*) AS total,
         SUM(status = 'new') AS new,
         SUM(status = 'contacted') AS contacted,
         SUM(status = 'done') AS done
       FROM leads`,
    );
    const byKindRows = await query<{ kind: string; n: number }[]>(
      'SELECT kind, COUNT(*) AS n FROM leads GROUP BY kind',
    );
    const recent = await query(
      'SELECT id, kind, name, status, created_at FROM leads ORDER BY created_at DESC LIMIT 5',
    );
    const row = leadAgg[0] as { total: number; new: number; contacted: number; done: number };
    res.json({
      vehicles: { total: Number(vehicleRows[0].n) },
      leads: {
        total: Number(row.total),
        new: Number(row.new),
        contacted: Number(row.contacted),
        done: Number(row.done),
        byKind: Object.fromEntries(byKindRows.map((r) => [r.kind, Number(r.n)])),
      },
      recent,
    });
  } catch (err) {
    next(err);
  }
});

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
    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT image, gallery FROM vehicles WHERE id = ?',
      [id],
    );
    const existing = existingRows[0] as unknown as { image: string; gallery: string };
    if (!existing) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
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
    let oldGallery: string[] = [];
    try {
      oldGallery = JSON.parse(existing.gallery);
    } catch {
      oldGallery = [];
    }
    const oldLocal = localUploadPaths([existing.image, ...(Array.isArray(oldGallery) ? oldGallery : [])]);
    const newLocal = localUploadPaths([v.image, ...v.gallery]);
    for (const basename of oldLocal) {
      if (!newLocal.includes(basename)) {
        await deleteIfUnreferenced(basename, id);
      }
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
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT image, gallery FROM vehicles WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
    const existing = rows[0] as unknown as { image: string; gallery: string };
    let gallery: string[] = [];
    try {
      gallery = JSON.parse(existing.gallery);
    } catch {
      gallery = [];
    }
    for (const basename of localUploadPaths([existing.image, ...(Array.isArray(gallery) ? gallery : [])])) {
      await deleteIfUnreferenced(basename);
    }
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
