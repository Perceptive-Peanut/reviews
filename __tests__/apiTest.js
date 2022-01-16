/* eslint-disable */
const frisby = require('frisby');
const Joi = frisby.Joi;

const randomIdGenerator = () => {
  return Math.floor(Math.random() * 1000012);
};

it ('Get reviews should return a status of 200', function () {
  let id = randomIdGenerator();
  return frisby
    .get(`http://localhost:3000/reviews?product_id=${id}`)
    .expect('status', 200)
    .expect('json', 'product', `${id}`)
    .expect('jsonTypes', 'count', Joi.number());
});

it ('Get reviews should return expected fields', function () {
  let id = randomIdGenerator();
  return frisby
    .get(`http://localhost:3000/reviews?product_id=${id}`)
    .expect('json', 'product', `${id}`)
    .expect('jsonTypes', 'count', Joi.number())
    .expect('jsonTypes', 'results.*', {
      'review_id': Joi.number().required(),
      'rating': Joi.number().required(),
      'summary': Joi.string(),
      'recommend': Joi.boolean(),
      'body': Joi.string(),
      'date': Joi.date().iso().required(),
      'reviewer_name': Joi.string().required(),
      'helpfulness': Joi.number().required()
    });
});

it ('GET meta should return a status of 200', function () {
  let id = randomIdGenerator();
  return frisby
    .get(`http://localhost:3000/reviews/meta?product_id=${id}`)
    .expect('status', 200);
});

it ('Get meta should return expected fields', function () {
  let id = randomIdGenerator();
  return frisby
    .get(`http://localhost:3000/reviews/meta?product_id=${id}`)
    .expect('json', 'product_id', `${id}`)
    .expect('jsonTypes', 'ratings', Joi.object().required())
    .expect('jsonTypes', 'recommended', Joi.object().required())
    .expect('jsonTypes', 'characteristics', Joi.object().required());
});

it ('POST review should return a status of 201 Created', function () {
  return frisby
    .post('http://localhost:3000/reviews', {
      body: {
        "product_id": 997731,
        "rating" : 5,
        "summary" : "This product was amazing!",
        "body" : "I really loved this product. It was everything I could want and more",
        "recommend" : true,
        "reviewer_name" : "helloworld",
        "reviewer_email" : "helloworld@gmail.com",
        "photos" : ["https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80", "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80"],
        "characteristics" : {
          "1" : 5,
          "2" : 5,
          "3" : 5,
          "4" : 5
        }
      }
    })
    .expect('status', 201);
});
