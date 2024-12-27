const mongoose = require('mongoose');

const nykaProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true }, 
});

const NykaProduct = mongoose.model('NykaProduct', nykaProductSchema);
module.exports = NykaProduct;