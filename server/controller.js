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
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
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
      .catch(err => {
        console.log(err);
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
        console.log(err);
        res.sendStatus(500);
      });
  },

  updateReport: (req, res) => {
    model.addReport(req.params.review_id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  }
};