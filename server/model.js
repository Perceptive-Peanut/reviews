/* eslint-disable */
const client = require('../db/index.js');

module.exports = {
  getAllReviews: (productId, count, sort) => {
    count = count || 5;
    let text;
    if (sort === 'newest') {
      text = `SELECT json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', TO_TIMESTAMP(r.date/1000), 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos', (SELECT json_agg(json_build_object('id', p.photo_id, 'url', p.url)) FROM photos p WHERE r.id = p.review_id))) FROM reviews r WHERE r.product_id = $1 AND r.reported = false GROUP BY r.date ORDER BY r.date DESC LIMIT $2`;
    } else {
      text = `SELECT json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', TO_TIMESTAMP(r.date/1000), 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos', (SELECT json_agg(json_build_object('id', p.photo_id, 'url', p.url)) FROM photos p WHERE r.id = p.review_id))) FROM reviews r WHERE r.product_id = $1 AND r.reported = false GROUP BY r.helpfulness ORDER BY r.helpfulness LIMIT $2`;
    }
    let values = [productId, count];
    return client.query(text, values)
      .then((results) => {
        return results.rows[0].json_agg;
      })
      .catch((err) => console.error(err.stack));
  },

  getMetaData: (productId) => {
    let text = 'SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC';
    let values = [productId];
    let text2 = 'SELECT recommend, COUNT (recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend';
    let values2 = [productId];
    let text3 = `SELECT c.name, (SELECT json_build_object('id', c.id, 'value', AVG (cr.value))) FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.id`
    let values3 = [productId];
    const queries = [client.query(text, values), client.query(text2, values2), client.query(text3, values3)]
    return Promise.all(queries)
      .then((results) => {
        return [results[0].rows, results[1].rows, results[2].rows];
      })
      .catch(e => console.error(e.stack));
  },

  postReviews: ({ product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics }) => {
    summary = summary || null;
    body = body || null;
    let text = 'INSERT INTO reviews(product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id AS review_id';
    let values = [product_id, rating, summary, body, recommend, reviewer_name, reviewer_email];

    return client.query(text, values)
      .then((results) => {
        return results.rows[0].review_id;
      })
      .then((review_id) => {
        let queries = [];
        if (photos && photos.length !== 0) {
          let text2 = 'INSERT INTO photos(review_id, url) VALUES'
          for (let i = 0; i < photos.length; i++) {
            text2 += `(${review_id}, '${photos[i]}'), `
          }
          text2 = text2.slice(0, -2);
          queries.push(client.query(text2));
        }

        if (characteristics && Object.keys(characteristics).length !== 0) {
          let text3 = 'INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES';
          for (let key in characteristics) {
            text3 += `(${key}, ${review_id}, ${characteristics[key]}), `
          }
          text3 = text3.slice(0, -2);
          queries.push(client.query(text3));
        }
        return Promise.all(queries);
      })
      .catch(e => console.error(e.stack));
    },

    addHelpful: (review_id) => {
      let text = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1';
      let values = [review_id];
      return client.query(text, values)
        .then((results) => {
          return results;
        })
        .catch((err) => console.error(err.stack));
    },

    addReport: (review_id) => {
      let text = 'UPDATE reviews SET reported = true WHERE id = $1';
      let values = [review_id];
      return client.query(text, values)
        .then((results) => {
          return results;
        })
        .catch((err) => console.error(err.stack));
    }
  };