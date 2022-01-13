const db = require('../db/index.js');

module.exports = {
  getAllReviews: () => {
    // need another query for sort by date
    const text = 'SELECT reviews.id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, photos.id, photos.url FROM reviews LEFT JOIN photos ON reviews.id = photos.review_id WHERE reviews.product_id = $1 AND reviews.reported = false ORDER BY helpfulness DESC LIMIT $2';
    const values = [2, 5];
    client.query(text, values)
      .then(res => {
        console.log(res.rows);
        // product id, page, and count need to be added
        // date needs to be converted to 2022-01-05T00:00:00.000Z (SELECT to_timestamp(unix timestamp/1000) AT TIME ZONE 'UTC'; --> 2020-07-30 03:41:21)
        // photos need to be put in array
      })
      .catch(e => console.error(e.stack));
  }
};

/*
[
  {
    id: '2',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
  },
  {
    id: '1',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
  },
  {
    id: null,
    rating: 4,
    summary: 'I am liking these glasses',
    recommend: true,
    response: "Glad you're enjoying the product!",
    body: "They are very dark.  But that's good because I'm in very sunny spots",
    date: '1609325851021',
    reviewer_name: 'bigbrotherbenjamin',
    helpfulness: 5,
    url: null
  },
  {
    id: '3',
    rating: 3,
    summary: "I'm enjoying wearing these shades",
    recommend: true,
    response: 'null',
    body: 'Comfortable and practical.',
    date: '1615987717620',
    reviewer_name: 'shortandsweeet',
    helpfulness: 5,
    url: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'
  },
  {
    id: null,
    rating: 4,
    summary: 'They look good on me',
    recommend: true,
    response: 'null',
    body: 'I so stylish and just my aesthetic.',
    date: '1593628485253',
    reviewer_name: 'fashionperson',
    helpfulness: 1,
    url: null
  }
]
*/