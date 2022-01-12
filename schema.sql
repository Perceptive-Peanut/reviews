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
  id BIGSERIAL PRIMARY KEY,
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

\COPY reviews FROM '/Users/saarika/Documents/HackReactor/SDCData/reviews.csv' DELIMITER ',' CSV HEADER; --COPY 5774952
\COPY photos FROM '/Users/saarika/Documents/HackReactor/SDCData/reviews_photos.csv' DELIMITER ',' CSV HEADER; --COPY 2742540
\COPY characteristics FROM '/Users/saarika/Documents/HackReactor/SDCData/characteristics.csv' DELIMITER ',' CSV HEADER; --COPY 3347679
\COPY characteristic_reviews FROM '/Users/saarika/Documents/HackReactor/SDCData/characteristic_reviews.csv' DELIMITER ',' CSV HEADER; --COPY 19327575

CREATE INDEX review_product_idx ON reviews(product_id);

/*  Execute this file from the command line by typing:
 *    psql postgres < schema.sql
 *  to create the database and the tables.*/