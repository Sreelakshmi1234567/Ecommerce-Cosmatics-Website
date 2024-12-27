const mongoose = require('mongoose');

const maybellineProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const MaybellineProduct = mongoose.model('MaybellineProduct', maybellineProductSchema);
module.exports = MaybellineProduct;
