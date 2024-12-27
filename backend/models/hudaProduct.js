const mongoose = require('mongoose');

const hudaProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const HudaProduct = mongoose.model('HudaProduct', hudaProductSchema);
module.exports = HudaProduct;