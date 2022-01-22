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
SELECT rating, COUNT (rating) FROM reviews WHERE product_id = 1 GROUP BY rating ORDER BY rating ASC
-- Recommends grouped and counted
SELECT recommend, COUNT (recommend) FROM reviews WHERE product_id = 1 GROUP BY recommend
-- Characteristics grouped and averaged
SELECT c.name, (SELECT json_build_object('id', c.id, 'value', AVG (cr.value))) FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.id

--Combine all meta queries
SELECT json_build_object('product_id', product_id, 'ratings', (SELECT json_object_agg(rating, count) FROM (SELECT rating, count(*) as count from reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC) r), 'recommended', (SELECT json_object_agg(recommend, count) FROM (SELECT recommend, count(*) as count FROM reviews WHERE product_id = $1 group by recommend) rec), 'characteristics', (SELECT json_object_agg(name, json_build_object('id', id, 'value', value)) FROM (SELECT  c.name, c.id, sum(value)/count(*) as value FROM characteristics c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id WHERE c.product_id = $1 GROUP BY c.name, c.id) r)) FROM reviews WHERE product_id = $1