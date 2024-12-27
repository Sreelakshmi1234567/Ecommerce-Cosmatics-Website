const mongoose = require('mongoose');

const lorealProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const LorealProduct = mongoose.model('LorealProduct', lorealProductSchema);
module.exports = LorealProduct;