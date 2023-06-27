const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64955b6a6d47f7bb14ef2bd3',
  };

  next();
});

app.use(routes);

app.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
