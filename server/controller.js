/* eslint-disable */
const model = require('./model');

module.exports = {
  getReviews: (req, res) => {
    const { product_id, count, sort } = req.query;
    model.getAllReviews(product_id, count, sort)
      .then((results) => {
        const allReviews = {
          product: product_id,
          count, results
        }
        res.status(200).send(allReviews);
        // date needs to be converted to 2022-01-05T00:00:00.000Z (SELECT to_timestamp(unix timestamp/1000) AT TIME ZONE 'UTC'; --> 2020-07-30 03:41:21)
      })
      .catch(err => { console.log(err); });
  },
  getMeta: (req, res) => {
    const { product_id } = req.query
    model.getMetaData(product_id)
      .then((results) => {
        console.log('DB results: ', results);
        res.status(200).send(results);
      })
      .catch(err => { console.log(err); });
  },
  postReview: (req, res) => {
    model.postReviews(req.query)
      .then(() => {

      })
      .catch(err => { console.log(err); });
  }
};