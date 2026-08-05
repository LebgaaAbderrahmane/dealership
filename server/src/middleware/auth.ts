import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_EXPIRES_IN = '8h';

export function signToken(admin: { id: number; username: string }) {
  return jwt.sign({ sub: admin.id, username: admin.username }, process.env.JWT_SECRET ?? 'dev-secret', {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export interface AuthedRequest extends Request {
  admin?: { id: number; username: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET ?? 'dev-secret');
    req.admin = { id: Number(payload.sub), username: String(payload.username) };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
