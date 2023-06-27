const express = require('express');
const http2 = require('http2');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64955b6a6d47f7bb14ef2bd3',
  };

  next();
});

app.use(routes);
app.use(express.json());
app.use('/', (req, res) => {
  res.status(http2.constants.STATUS_NOT_FOUND).json({ message: 'Что-то пошло не так' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
