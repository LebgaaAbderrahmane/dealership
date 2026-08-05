import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';
import { DEFAULT_SETTINGS, SETTING_KEYS } from '../settings-defaults';

const statSchema = z.object({ value: z.string().max(40), label: z.string().max(80) });
const trustItemSchema = z.object({ label: z.string().min(1).max(120), sub: z.string().max(240) });

const str = (max: number) => z.string().max(max);

const settingsSchema = z.object({
  dealer: z
    .object({
      name: str(120).min(1),
      phone: str(40),
      phoneHref: str(200),
      salesEmail: str(160),
      serviceEmail: str(160),
      addressLine1: str(160),
      addressLine2: str(160),
      license: str(60),
    })
    .partial(),
  hours: z
    .object({
      sales: str(240),
      service: str(240),
    })
    .partial(),
  hero: z
    .object({
      eyebrow: str(240),
      subline: str(1000),
      stats: z.array(statSchema).max(8),
    })
    .partial(),
  trust: z.array(trustItemSchema).max(8),
  social: z
    .object({
      instagram: str(300),
      facebook: str(300),
      youtube: str(300),
      whatsapp: str(300),
    })
    .partial(),
  footer: z
    .object({
      blurb: str(1000),
    })
    .partial(),
}).partial();

export type SettingsBody = z.infer<typeof settingsSchema>;

function parseStored(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function mergeValue(defaultValue: unknown, stored: unknown): unknown {
  if (
    stored !== null &&
    typeof stored === 'object' &&
    !Array.isArray(stored) &&
    defaultValue !== null &&
    typeof defaultValue === 'object' &&
    !Array.isArray(defaultValue)
  ) {
    const out: Record<string, unknown> = { ...(defaultValue as Record<string, unknown>) };
    for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
      out[k] = mergeValue(out[k], v);
    }
    return out;
  }
  return stored === undefined || stored === null ? defaultValue : stored;
}

export const settingsRouter = Router();

settingsRouter.get('/', async (_req, res, next) => {
  try {
    const rows = await pool.query<RowDataPacket[]>(
      'SELECT setting_key, value FROM settings',
    );
    const stored = new Map<string, unknown>();
    for (const row of rows[0]) {
      const parsed = parseStored(row.value);
      if (parsed !== null) {
        stored.set(row.setting_key, parsed);
      }
    }
    const merged: Record<string, unknown> = {};
    for (const key of SETTING_KEYS) {
      merged[key] = mergeValue(DEFAULT_SETTINGS[key], stored.get(key));
    }
    res.json(merged);
  } catch (err) {
    next(err);
  }
});

settingsRouter.put('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
      return;
    }
    const body = parsed.data as SettingsBody;
    for (const key of SETTING_KEYS) {
      const patch = body[key];
      if (patch === undefined) continue;
      const [existingRows] = await pool.query<RowDataPacket[]>(
        'SELECT value FROM settings WHERE setting_key = ?',
        [key],
      );
      let existing: unknown = DEFAULT_SETTINGS[key];
      if (existingRows.length > 0) {
        const parsed = parseStored(existingRows[0].value);
        if (parsed !== null) {
          existing = parsed;
        }
      }
      const merged = mergeValue(existing, patch);
      if (existingRows.length === 0) {
        await pool.query('INSERT INTO settings (setting_key, value) VALUES (?, ?)', [
          key,
          JSON.stringify(merged),
        ]);
      } else {
        await pool.query('UPDATE settings SET value = ? WHERE setting_key = ?', [
          JSON.stringify(merged),
          key,
        ]);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
