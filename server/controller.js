/* eslint-disable */
const model = require('./model');

module.exports = {
  getReviews: (req, res) => {
    let { product_id, count, sort } = req.query;
    model.getAllReviews(product_id, count, sort)
      .then((data) => {
        let results = data.rows[0].json_agg;
        count = count || 5;
        const allReviews = {
          product: product_id,
          count,
          results
        }
        res.status(200).send(allReviews);
      })
      .catch(err => {
        console.error(err.stack);
        res.sendStatus(500);
      });
  },

  getMeta: (req, res) => {
    const { product_id } = req.query
    model.getMetaData(product_id)
      .then((results) => {
        res.status(200).send(results.rows[0].json_build_object);
      })
      .catch(err => {
        console.error(e.stack);
        res.sendStatus(500);
      });
  },

  postReview: (req, res) => {
    model.postReviews(req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  },

  updateHelpful: (req, res) => {
    model.addHelpful(req.params.review_id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.error(err.stack);
        res.sendStatus(500);
      });
  },

  updateReport: (req, res) => {
    model.addReport(req.params.review_id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.error(err.stack);
        res.sendStatus(500);
      });
  }
};