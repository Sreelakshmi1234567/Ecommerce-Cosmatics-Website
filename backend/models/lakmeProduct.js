const mongoose = require('mongoose');

const lakmeProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const LakmeProduct = mongoose.model('LakmeProduct', lakmeProductSchema);
module.exports = LakmeProduct;