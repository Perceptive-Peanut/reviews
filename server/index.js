require('newrelic');
const express = require('express');
const path = require('path');
const db = require('../db/index.js');
const controller = require('./controller');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/loaderio-3d95bf57cf434f6ddcdd68cc6efd5ffc', (req, res) => {
  let options = {
    root: path.join(__dirname)
  };
  let fileName = 'loaderio-3d95bf57cf434f6ddcdd68cc6efd5ffc.txt';
  res.sendFile(fileName, options);
});
app.get('/loaderio-794f8e51787086f1bbce92abc79b7588', (req, res) => {
  let options = {
    root: path.join(__dirname)
  };
  let fileName = 'loaderio-794f8e51787086f1bbce92abc79b7588.txt';
  res.sendFile(fileName, options);
});

app.get('/reviews', controller.getReviews);
app.get('/reviews/meta', controller.getMeta);
app.post('/reviews', controller.postReview);
app.put('/reviews/:review_id/helpful', controller.updateHelpful);
app.put('/reviews/:review_id/report', controller.updateReport);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});