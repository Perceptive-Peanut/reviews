/* eslint-disable */
const mongoose = require('mongoose');

let productSchema = mongoose.Schema({
  product_id: Number,
  reviews: [reviewSchema]
})

let reviewSchema = mongoose.Schema({
  review_id: { type: Number, unique: true },
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: { type: Date, default: Date.now },
  reviewer_name: String,
  review_email: String,
  helpfulness: Number,
  reported: { type: Boolean, default: false },
  photos: { type: [String], default: [] },
  characteristics: {charSchema},
  product_id: Number
});

let charSchema = mongoose.Schema({
  fit: Number,
  length: Number,
  comfort: Number,
  quality: Number
});

let Product = mongoose.model('Product', productSchema);
let Review = mongoose.model('Review', reviewSchema);
let Chars = mongoose.model('Chars', charSchema);