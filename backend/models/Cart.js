const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      brand: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true }, 
      quantity: { type: Number, required: true, default: 1 },
      imagePath: { type: String, required: true }, 
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
