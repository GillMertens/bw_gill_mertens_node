const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => console.log('PostgreSQL connected...'))
  .catch(err => console.log(err));

app.use(bodyParser.json());

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));