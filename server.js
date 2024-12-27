const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('./storage');

const app = express();
const PORT = 3000;

app.use(express.json());

let data = readData();

app.get('/', (req, res) => {
  if (!data.clicks['/']) data.clicks['/'] = 0;
  data.clicks['/']++;
  writeData(data);
  res.send(`<p>Количество кликов на главной странице: ${data.clicks['/']}</p>
    <a href="/about">Перейти на страницу "Обо мне"</a>`);
});

app.get('/about', (req, res) => {
  if (!data.clicks['/about']) data.clicks['/about'] = 0;
  data.clicks['/about']++;
  writeData(data);
  res.send(`<p>Количество кликов на странице "Обо мне": ${data.clicks['/about']}</p>
    <a href="/">Перейти на главную страницу</a>`);
});

app.get('/users', (req, res) => {
  res.status(200).json(data.users || []);
});

app.post('/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Имя пользователя обязательно!' });
  }

  const newUser = {
    id: uuidv4(),
    username: username.trim(),
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  writeData(data);
  res.status(201).json(newUser);
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = data.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден!' });
  }

  const [deletedUser] = data.users.splice(userIndex, 1);
  writeData(data);
  res.status(200).json({ message: 'Пользователь удалён!', user: deletedUser });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  const user = data.users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден!' });
  }

  if (username) {
    user.username = username.trim();
  }

  writeData(data);
  res.status(200).json(user);
});

app.use((req, res) => {
  res.status(404).send('<h1>Страница не найдена!</h1>');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
