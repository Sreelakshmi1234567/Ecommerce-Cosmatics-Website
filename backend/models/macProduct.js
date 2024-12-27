const mongoose = require('mongoose');

const macProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const MacProduct = mongoose.model('MacProduct', macProductSchema);
module.exports = MacProduct;