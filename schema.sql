DROP DATABASE if exists reviews;
CREATE DATABASE reviews;

DROP TABLE reviews;
DROP TABLE photos;
DROP TABLE characteristics;
DROP TABLE characteristic_reviews;

CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT DEFAULT extract(epoch FROM NOW()),
  summary VARCHAR(255),
  body VARCHAR(1000),
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response VARCHAR(1000) DEFAULT null,
  helpfulness INT DEFAULT 0
);

CREATE TABLE photos (
  photo_id BIGSERIAL PRIMARY KEY,
  review_id INT,
  url VARCHAR(255)
);

CREATE TYPE characteristic AS ENUM ('Size', 'Width', 'Fit', 'Length', 'Comfort', 'Quality');

CREATE TABLE characteristics (
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name characteristic
);

CREATE TABLE characteristic_reviews (
  id BIGSERIAL PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  value SMALLINT
);

ALTER TABLE photos ADD CONSTRAINT reviews_fkey FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;
ALTER TABLE characteristic_reviews ADD CONSTRAINT char_fkey FOREIGN KEY(characteristic_id) REFERENCES characteristics(id) ON DELETE CASCADE;
ALTER TABLE characteristic_reviews ADD CONSTRAINT review_fkey FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE;
--ALTER TABLE reviews ALTER COLUMN date SET DATA TYPE timestamp with time zone USING to_timestamp(date/1000);

CREATE INDEX review_product_idx ON reviews(product_id);
CREATE INDEX photos_review_idx ON photos(review_id);