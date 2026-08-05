import { Router } from 'express';
import { pool, query } from '../db';

const SORTS: Record<string, string> = {
  'price-asc': 'price ASC',
  'price-desc': 'price DESC',
  'miles-asc': 'miles ASC',
  'monthly-asc': 'monthly ASC',
  featured: 'id ASC',
};

export const vehiclesRouter = Router();

vehiclesRouter.get('/meta', async (_req, res, next) => {
  try {
    const [countRows] = await pool.query<{ n: number }[]>(
      'SELECT COUNT(*) AS n FROM vehicles',
    );
    const makes = await query<{ make: string }[]>('SELECT DISTINCT make FROM vehicles ORDER BY make');
    const types = await query<{ type: string }[]>('SELECT DISTINCT type FROM vehicles ORDER BY type');
    res.json({
      count: Number(countRows[0].n),
      makes: makes.map((r) => r.make),
      types: types.map((r) => r.type),
    });
  } catch (err) {
    next(err);
  }
});

vehiclesRouter.get('/', async (req, res, next) => {
  try {
    const type = typeof req.query.type === 'string' && req.query.type !== 'All' ? req.query.type : null;
    const make = typeof req.query.make === 'string' && req.query.make !== 'All' ? req.query.make : null;
    const maxPrice = Number(req.query.maxPrice) || 90000;
    const maxMonthly = Number(req.query.maxMonthly) || 10000;
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const sort = typeof req.query.sort === 'string' && SORTS[req.query.sort] ? SORTS[req.query.sort] : SORTS.featured;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 9));
    const offset = (page - 1) * limit;

    const where: string[] = ['price <= :maxPrice', 'monthly <= :maxMonthly'];
    const params: Record<string, unknown> = { maxPrice, maxMonthly };
    if (type) {
      where.push('type = :type');
      params.type = type;
    }
    if (make) {
      where.push('make = :make');
      params.make = make;
    }
    if (q) {
      where.push('(LOWER(name) LIKE :q OR LOWER(make) LIKE :q OR LOWER(type) LIKE :q)');
      params.q = `%${q}%`;
    }
    const whereSql = `WHERE ${where.join(' AND ')}`;

    const [countRows] = await pool.query<{ n: number }[]>(
      `SELECT COUNT(*) AS n FROM vehicles ${whereSql}`,
      params,
    );
    const vehicles = await query(
      `SELECT * FROM vehicles ${whereSql} ORDER BY ${sort} LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset },
    );
    res.json({ vehicles, total: Number(countRows[0].n), page, limit });
  } catch (err) {
    next(err);
  }
});

vehiclesRouter.get('/:id/similar', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid vehicle id' });
      return;
    }
    const limit = Math.min(9, Math.max(1, Number(req.query.limit) || 3));
    const target = await query<{ type: string; make: string; price: number }[]>(
      'SELECT type, make, price FROM vehicles WHERE id = :id',
      { id },
    );
    if (target.length === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    const t = target[0];
    const rows = await query(
      `SELECT * FROM vehicles
       WHERE id <> :id
       ORDER BY (type = :type) DESC, (make = :make) DESC, ABS(price - :price) ASC, id ASC
       LIMIT :limit`,
      { id, type: t.type, make: t.make, price: t.price, limit },
    );
    res.json({ vehicles: rows });
  } catch (err) {
    next(err);
  }
});

vehiclesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid vehicle id' });
      return;
    }
    const rows = await query('SELECT * FROM vehicles WHERE id = :id', { id });
    if (rows.length === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
