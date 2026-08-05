import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db';
import { requireAuth, signToken, type AuthedRequest } from '../middleware/auth';

const loginSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(200),
});

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    const { username, password } = parsed.data;
    const [rows] = await pool.query<{ id: number; username: string; password_hash: string }[]>(
      'SELECT id, username, password_hash FROM admins WHERE username = ?',
      [username],
    );
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = signToken({ id: admin.id, username: admin.username });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});
