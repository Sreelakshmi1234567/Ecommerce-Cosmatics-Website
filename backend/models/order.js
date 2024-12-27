

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId,required: true }, 
      quantity: { type: Number, required: true },
      imagePath: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  razorpayOrderId: { type: String, required: false }, 
  address: { type: Object, required: true }, 
  paymentStatus: { type: String, required: true }, 
  paymentMethod: { type: String, required: true }, 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
 

