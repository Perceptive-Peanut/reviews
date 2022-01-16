const { Pool } = require('pg');

const pool = new Pool({
  database: 'reviews',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// const tx = async (callback) => {
//   const client = await pool.connect()
//   try {
//   await client.query('BEGIN')
//     try {
//       await callback(client)
//       client.query('COMMIT')
//     } catch(e) {
//       client.query('ROLLBACK')
//     }
//   } finally {
//     client.release()
//   }
// }
// async function query (q) {
//   const client = await pool.connect()
//   let res
//   try {
//     await client.query('BEGIN')
//     try {
//       res = await client.query(q)
//       await client.query('COMMIT')
//     } catch (err) {
//       await client.query('ROLLBACK')
//       throw err
//     }
//   } finally {
//     client.release()
//   }
//   return res
// }