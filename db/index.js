const { Client } = require('pg');

const client = new Client({
  database: 'reviews',
  port: 5432,
});

client.connect()
  .then(() => { console.log('PostgreSQL connected!'); })
  .catch(e => console.error(e.stack));

module.exports = client;