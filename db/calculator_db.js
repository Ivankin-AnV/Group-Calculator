import { Pool } from 'pg';  // Это лучший вариант для ES-модулей.
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'calculator',
  password: process.env.DB_PASSWORD || '1111',
  port: process.env.DB_PORT || 5432,
});

// Функции для работы с базой данных
export const query = (text, params) => pool.query(text, params);

export async function saveOperation(expression, result) {
  await pool.query(
    'INSERT INTO history (expression, result) VALUES ($1, $2)',
    [expression, result]
  );
}

export async function getHistory() {
  const res = await pool.query('SELECT * FROM history ORDER BY id DESC');
  return res.rows;
}
