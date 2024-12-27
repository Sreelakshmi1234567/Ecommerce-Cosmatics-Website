const mongoose = require('mongoose');

const WishlistCartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  imagePath: { type: String, required: true }, 
  brand: { type: String, required: true }, 
  quantity: { type: Number, required: true, default: 1 }, 
  name: { type: String, required: true },
 price: { type: Number, required: true }, 
});

module.exports = mongoose.model('WishlistCart', WishlistCartSchema);

