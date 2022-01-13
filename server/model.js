/* eslint-disable */
const client = require('../db/index.js');

module.exports = {
  getAllReviews: (productId, count, sort) => {
    let text;
    if (sort === 'newest') {
      text = `SELECT json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', r.date, 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos', (SELECT json_agg(json_build_object('id', p.photo_id, 'url', p.url)) FROM photos p WHERE r.id = p.review_id))) FROM reviews r WHERE r.product_id = $1 AND r.reported = false ORDER BY date DESC LIMIT $2`;
    } else {
      text = `SELECT json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', r.date, 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos', (SELECT json_agg(json_build_object('id', p.photo_id, 'url', p.url)) FROM photos p WHERE r.id = p.review_id))) FROM reviews r WHERE r.product_id = $1 AND r.reported = false LIMIT $2`;
    }
    let values = [productId, count];
    return client.query(text, values)
      .then((results) => {
        return results.rows[0].json_agg;
      })
      .catch((err) => console.error(err.stack));
  },
  getMetaData: (productId) => {
    // group by chars
    // get avg of chars for each review
    let text = 'SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC';
    let values = [productId];
    let text2 = 'SELECT recommend, COUNT (recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend';
    let values2 = [productId];
    return client.query(text2, values2)
      .then(results => {
        return results.rows;
      })
      .catch(e => console.error(e.stack));
  },
  postReviews: () => {

    let text = '';
    let values = [];
    client.query(text, values)
      .then(res => {
        console.log(res.rows);
      })
      .catch(e => console.error(e.stack));
  }
};

// SELECT json_object_keys(SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC))

/* Reviews Meta DB results
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