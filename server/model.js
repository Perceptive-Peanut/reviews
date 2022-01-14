/* eslint-disable */
const client = require('../db/index.js');

module.exports = {
  getAllReviews: (productId, count, sort) => {
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
    let queries = [client.query(text, values)];

    if (characteristics && Object.keys(characteristics).length !== 0) {
      let text2 = 'INSERT INTO characteristics(product_id, name) VALUES($1, $2) RETURNING id, name';
      for (let key of characteristics) {
        let values2 = [product_id, key];
        queries.push(client.query(text2, values2));
      }
    }

    return Promise.all(queries)
      .then((results) => {
        return results[0].rows[0];
      })
      .then(({review_id}) => {
        let queries2 = [];
        if (photos && photos.length !== 0) {
          let text3 = 'INSERT INTO photos(review_id, url) VALUES($1, $2)'
          for (let i = 0; i < photos.length; i++) {
            let values3 = [review_id, photos[i]];
            queries2.push(client.query(text3, values3));
          }
        }
        if (characteristics && Object.keys(characteristics).length !== 0) {
          let text4 = 'INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES($1, $2, $3)';
          for (let key of characteristics) {
            let values4 = [characteristic_id, review_id, characteristics[key]];
            queries2.push(client.query(text4, values4));
          }
        }
        return Promise.all(queries2);
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

/* Reviews Meta DB results
Reviews (id) added" 5774954, 5774955, 5774956, 5774957
{
    "product_id": 1,
    "rating" : 5,
    "summary" : "This product was amazing!",
    "body" : "I really loved this product. It was everything I could want and more",
    "recommend" : true,
    "reviewer_name" : "helloworld",
    "reviewer_email" : "helloworld@gmail.com"
}

[
  { rating: 2, count: '1' },
  { rating: 3, count: '1' },
  { rating: 4, count: '2' },
  { rating: 5, count: '1' }
]

[
    {
        "recommend": false,
        "count": "2"
    },
    {
        "recommend": true,
        "count": "3"
    }
]

SELECT json_build_object(c.name, (SELECT json_build_object('id', c.id, 'value', AVG (cr.value)))) FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.id
[
    {
        "json_build_object": {
            "Fit": {
                "id": 1,
                "value": 4
            }
        }
    },
    {
        "json_build_object": {
            "Length": {
                "id": 2,
                "value": 3.5
            }
        }
    },
    {
        "json_build_object": {
            "Comfort": {
                "id": 3,
                "value": 5
            }
        }
    },
    {
        "json_build_object": {
            "Quality": {
                "id": 4,
                "value": 4
            }
        }
    }
]

SELECT c.name, (SELECT json_build_object('id', c.id, 'value', AVG (cr.value))) FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.id
[
    {
        "name": "Fit",
        "json_build_object": {
            "id": 1,
            "value": 4
        }
    },
    {
        "name": "Length",
        "json_build_object": {
            "id": 2,
            "value": 3.5
        }
    },
    {
        "name": "Comfort",
        "json_build_object": {
            "id": 3,
            "value": 5
        }
    },
    {
        "name": "Quality",
        "json_build_object": {
            "id": 4,
            "value": 4
        }
    }
]

Reviews Meta Data Needed
{
  "product_id": "63609",
  "ratings": {
      "4": "1",
      "5": "8"
  },
  "recommended": {
      "false": "1",
      "true": "8"
  },
  "characteristics": {
      "Fit": {
          "id": 213423,
          "value": "4.0000000000000000"
      },
      "Length": {
          "id": 213424,
          "value": "3.5000000000000000"
      },
      "Comfort": {
          "id": 213425,
          "value": "5.0000000000000000"
      },
      "Quality": {
          "id": 213426,
          "value": "4.0000000000000000"
      }
  }
}

-----------------------------------------------------------------------
GetAllReviews DB results (product_id: 2, sort: helpful, count: 5):  [
  {
    id: '3',
    rating: 4,
    summary: 'I am liking these glasses',
    recommend: true,
    response: "Glad you're enjoying the product!",
    body: "They are very dark.  But that's good because I'm in very sunny spots",
    date: '1609325851021',
    reviewer_name: 'bigbrotherbenjamin',
    helpfulness: 5,
    photo_id: null,
    url: null
  },
  {
    id: '5',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    photo_id: '2',
    url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
  },
  {
    id: '5',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    photo_id: '3',
    url: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'
  },
  {
    id: '5',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    photo_id: '1',
    url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
  },
  {
    id: '4',
    rating: 4,
    summary: 'They look good on me',
    recommend: true,
    response: 'null',
    body: 'I so stylish and just my aesthetic.',
    date: '1593628485253',
    reviewer_name: 'fashionperson',
    helpfulness: 1,
    photo_id: null,
    url: null
  }
]
*/