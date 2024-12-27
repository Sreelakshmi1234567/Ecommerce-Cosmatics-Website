const mongoose = require('mongoose');

const colorProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const ColorProduct = mongoose.model('ColorProduct', colorProductSchema);
module.exports = ColorProduct;