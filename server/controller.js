/* eslint-disable */
const model = require('./model');

module.exports = {
  getReviews: (req, res) => {
    const { product_id, count, sort } = req.query;
    model.getAllReviews(product_id, count, sort)
      .then((results) => {
        const allReviews = {
          product: product_id,
          count,
          results
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
        const metaData = {
          product_id,
          ratings: {},
          recommended: {},
          characteristics: {}
        }
        for (let i = 0; i < results[0].length; i++) {
          let currRating = results[0][i];
          metaData.ratings[currRating.rating] = currRating.count;
        }
        for (let j = 0; j < results[1].length; j++) {
          let currRec = results[1][j];
          metaData.recommended[currRec.recommend] = currRec.count;
        }
        for (let k = 0; k < results[2].length; k++) {
          let currChar = results[2][k];
          metaData.characteristics[currChar.name] = currChar['json_build_object'];
        }
        res.status(200).send(metaData);
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