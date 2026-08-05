import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'apex',
  password: process.env.DB_PASSWORD ?? 'apex',
  database: process.env.DB_NAME ?? 'apex',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  decimalNumbers: true,
});

export async function query<T extends mysql.RowDataPacket[] = mysql.RowDataPacket[]>(
  sql: string,
  params: Record<string, unknown> | unknown[] = [],
) {
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}
