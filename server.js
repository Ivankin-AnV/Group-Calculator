require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'calculator_db',
  password: process.env.PG_PASSWORD || 'postgres',
  port: process.env.PG_PORT || 5433
});

// Middleware
app.use(bodyParser.json());

// Проверка соединения с БД при старте
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err);
    process.exit(1);
  }
  console.log('Успешное подключение к PostgreSQL');
});

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существования пользователя
    const userExists = await pool.query(
      'SELECT * FROM Users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создание пользователя
    const newUser = await pool.query(
      `INSERT INTO Users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, email, created_at`,
      [username, email, passwordHash]
    );

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: newUser.rows[0].user_id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      user: newUser.rows[0],
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Авторизация пользователя
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Генерация токена
    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        user_id: user.rows[0].user_id,
        username: user.rows[0].username,
        email: user.rows[0].email
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Middleware проверки аутентификации
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
}

// Сохранение истории вычислений
app.post('/api/history', authenticateToken, async (req, res) => {
  try {
    const { operand1, operand2, operation, result, ip, device } = req.body;

    // Получение ID операции
    const opResult = await pool.query(
      'SELECT operation_id FROM Operations WHERE symbol = $1',
      [operation]
    );

    if (opResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неизвестная операция' });
    }

    const operationId = opResult.rows[0].operation_id;

    // Сохранение операндов
    const operand1Result = await pool.query(
      `INSERT INTO Operands (value, is_unary)
       VALUES ($1, $2)
       RETURNING operand_id`,
      [operand1, operand2 === null]
    );

    let operand2Id = null;
    if (operand2 !== null) {
      const operand2Result = await pool.query(
        `INSERT INTO Operands (value)
         VALUES ($1)
         RETURNING operand_id`,
        [operand2]
      );
      operand2Id = operand2Result.rows[0].operand_id;
    }

    // Сохранение истории
    const history = await pool.query(
      `INSERT INTO History (
        user_id,
        operand_id,
        operation_id,
        result,
        ip_address,
        device_info
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING history_id, calculation_time`,
      [
        req.user.userId,
        operand1Result.rows[0].operand_id,
        operationId,
        result,
        ip,
        device
      ]
    );

    res.json({
      success: true,
      historyId: history.rows[0].history_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сохранения истории' });
  }
});

// Получение истории вычислений
app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const history = await pool.query(
      `SELECT
        h.history_id,
        o1.value AS operand1,
        o2.value AS operand2,
        op.symbol AS operation,
        h.result,
        h.calculation_time
       FROM History h
       JOIN Operands o1 ON h.operand_id = o1.operand_id
       LEFT JOIN Operands o2 ON h.operand_id = o2.operand_id
       JOIN Operations op ON h.operation_id = op.operation_id
       WHERE h.user_id = $1
       ORDER BY h.calculation_time DESC
       LIMIT $2 OFFSET $3`,
      [req.user.userId, limit, offset]
    );

    res.json(history.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения истории' });
  }
});

// Заполнение базовых операций
async function seedOperations() {
  const operations = [
    { symbol: '+', is_function: false, precedence: 1 },
    { symbol: '-', is_function: false, precedence: 1 },
    { symbol: '*', is_function: false, precedence: 2 },
    { symbol: '/', is_function: false, precedence: 2 },
    { symbol: '^', is_function: false, precedence: 3 },
    { symbol: '√', is_function: true, precedence: 4 },
    { symbol: 'sin', is_function: true, precedence: 4 },
    { symbol: 'cos', is_function: true, precedence: 4 }
  ];

  for (const op of operations) {
    await pool.query(
      `INSERT INTO Operations (symbol, is_function, precedence)
       VALUES ($1, $2, $3)
       ON CONFLICT (symbol) DO NOTHING`,
      [op.symbol, op.is_function, op.precedence]
    );
  }
}

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  await seedOperations();
  console.log('Базовые операции добавлены');
});