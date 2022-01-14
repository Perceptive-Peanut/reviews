-- Generate Random ID: Math.floor(Math.random() * (max - min + 1) + min)
-- Total Product IDs: 1000011

--GET /reviews/

-- No shaping done by PostgreSQL: ORDER BY HELPFULNESS
  SELECT r.id, r.rating, r.summary, r.recommend, r.response, r.body, TO_TIMESTAMP(r.date/1000), r.reviewer_name, r.helpfulness, photos.photo_id, photos.url
    FROM reviews r LEFT JOIN photos
    ON r.id = photos.review_id WHERE r.product_id = $1 AND r.reported = false
    ORDER BY r.date DESC LIMIT $2

-- Shaping of photos array done by PostgreSQL
  SELECT json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', TO_TIMESTAMP(r.date/1000), 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos',
    (SELECT json_agg(json_build_object('id', p.photo_id, 'url', p.url)) FROM photos p WHERE r.id = p.review_id)))
    FROM reviews r WHERE r.product_id = $1 AND r.reported = false
    GROUP BY r.helpfulness ORDER BY r.helpfulness DESC LIMIT $2

---------------------------------------------------------------------------------------------------------
--GET /reviews/meta

-- Ratings grouped, counted, and ordered
SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC
-- Recommends grouped and counted
SELECT recommend, COUNT (recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend
-- Characteristics grouped and averaged
SELECT c.name, (SELECT json_build_object('id', c.id, 'value', AVG (cr.value))) FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.id

/* {
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    }, */

/* {
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
} */