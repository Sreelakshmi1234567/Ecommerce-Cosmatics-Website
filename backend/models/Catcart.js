const mongoose = require('mongoose');

const catcartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imagePath: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const CatCart = mongoose.model('CatCart', catcartSchema);

module.exports = CatCart;
