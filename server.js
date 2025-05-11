import express from 'express';
import cors from 'cors';
import { saveOperation, getHistory } from './db/calculator_db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/api/history', async (req, res) => {
  const { expression, result } = req.body;
  await saveOperation(expression, result);
  res.sendStatus(200);
});

app.get('/api/history', async (req, res) => {
  const history = await getHistory();
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
