/* eslint-disable */
const model = require('./model');

module.exports = {
  getReviews: (req, res) => {
    let { product_id, count, sort } = req.query;
    model.getAllReviews(product_id, count, sort)
      .then((data) => {
        let results;
        if (data.rows[0]) {
          results = data.rows[0].json_agg
        }
        count = count || 5;
        const allReviews = {
          product: product_id,
          count,
          results
        }
        res.status(200).send(allReviews);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  getMeta: (req, res) => {
    const { product_id } = req.query
    model.getMetaData(product_id)
      .then((results) => {
        let data = {
          product_id
        };
        if (results.rows[0]) {
          data = results.rows[0].json_build_object;
        }
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  postReview: (req, res) => {
    model.postReviews(req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  updateHelpful: (req, res) => {
    model.addHelpful(req.params.review_id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  updateReport: (req, res) => {
    model.addReport(req.params.review_id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};