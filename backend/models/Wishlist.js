const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  price: { type: Number, required: true }, 
  brand: { type: String, required: true }, 
});

module.exports = mongoose.model('Wishlist', wishlistSchema);

