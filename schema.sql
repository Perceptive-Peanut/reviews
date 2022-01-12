DROP DATABASE if exists reviews;
CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL,
  summary VARCHAR(60),
  recommend BOOLEAN,
  response VARCHAR,
  body VARCHAR(1000),
  date TIMESTAMP DEFAULT NOW(),
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  helpfulness SMALLINT,
  reported BOOLEAN DEFAULT false,
  product_id INT NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(255),
  review_id REFERENCES reviews ON DELETE CASCADE
);

CREATE TYPE characteristic AS ENUM ('fit', 'length', 'comfort', 'quality');

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  name characteristic,
  product_id INT NOT NULL
);

CREATE TABLE review_characteristics (
  id SERIAL PRIMARY KEY,
  value SMALLINT,
  characteristic_id REFERENCES characteristics,
  review_id REFERENCES reviews
)

CREATE INDEX review_product_idx ON reviews(product_id);

/*  Execute this file from the command line by typing:
 *    psql postgres < schema.sql
 *  to create the database and the tables.*/