const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const userController = require('./src/user_controller');

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection and create table
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to PostgreSQL database');
  
  client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `, (err) => {
    release();
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Users table ready');
    }
  });
});

app.locals.pool = pool;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:id', userController.getUserById);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database connection pool closed');
  process.exit(0);
});
