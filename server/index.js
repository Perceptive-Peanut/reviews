const express = require('express');
const db = require('../db/index.js');
const controller = require('./controller');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/reviews', controller.getReviews);
app.get('/reviews/meta', controller.getMeta);
app.post('/reviews', controller.postReview);
app.put('/reviews/:review_id/helpful', controller.updateHelpful);
app.put('/reviews/:review_id/report', controller.updateReport);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});