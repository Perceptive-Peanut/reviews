const { Pool } = require('pg');

const pool = new Pool({
  host: '',
  database: 'reviews',
  user: 'sdc',
  password: process.env.POSTGRES_PWD,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports.pool = pool;
