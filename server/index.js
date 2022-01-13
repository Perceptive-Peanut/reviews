const express = require('express');
const db = require('../db/index.js');

const app = express();
const PORT = 3000;

app.use(express.json());

// GET /reviews

// GET /reviews/meta

// POST /reviews

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});