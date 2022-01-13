--GET /reviews/
/* Parameter	Type	    Description
    page	    integer	   Selects the page of results to return. Default 1.
    count	    integer	   Specifies how many results per page to return. Default 5.
    sort	    text	     Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"
  product_id	integer	   Specifies the product for which to retrieve reviews. */

SELECT reviews.id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, photos.id, photos.url FROM reviews, photos
  WHERE reviews.id = photos.review_id AND product_id = product_id(query provided id) AND reported = false
  ORDER BY helpfulness(query provided sort) DESC
  LIMIT (query provided #);

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

--GET /reviews/meta
/* Parameter	Type	    Description
  product_id	integer	   Specifies the product for which to retrieve reviews. */

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