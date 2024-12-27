
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authenticateUser = require('../middleware/authenticateUser');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const WishlistCart = require('../models/WishlistCart');
const ProfileAddress = require('../models/ProfileAddress');
const router = express.Router();


const razorpay = new Razorpay({
  key_id: 'rzp_test_BJrRy7UBke7KlL',  
  key_secret: 'cTvNh9K4whjA38jzMvzQLYIh',  
});


router.post('/create-order', authenticateUser, async (req, res) => {
  try {
    const { amount, address, paymentMethod } = req.body;
    const userId = req.userId;

    console.log('Request Body:', req.body);
    console.log('User ID:', userId);

    
    const cart = await Cart.findOne({ userId });
    const wishlistCart = await WishlistCart.find({ userId });

    console.log('Fetched cart:', cart);
    console.log('Fetched wishlistCart:', wishlistCart);

    
    const combinedItems = [
      ...(cart ? cart.products : []),
      ...wishlistCart
    ];

    console.log("Combined Items:", combinedItems);

    if (combinedItems.length === 0) {
      return res.status(400).json({ message: 'Cart and Wishlist are empty. Cannot proceed with payment.' });
    }

    const validatedItems = combinedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      imagePath: item.imagePath,
      name: item.name,
    }));

    console.log("Validated Items:", validatedItems);

    const totalAmount = validatedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0); 
    console.log("Total Amount:", totalAmount);

    const amountInPaise = Math.round(totalAmount * 100);
    console.log("Amount in Paise:", amountInPaise);

   
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    });

    console.log("Razorpay Order Created:", razorpayOrder);

    if (!razorpayOrder || !razorpayOrder.id) {
      console.error('Error creating Razorpay order:', razorpayOrder);
      return res.status(500).json({ message: 'Error creating Razorpay order' });
    }

    
    const order = new Order({
      userId,
      items: validatedItems,
      totalAmount,
      address, 
      paymentStatus: 'Pending', 
      paymentMethod, 
      razorpayOrderId: razorpayOrder.id,
    });

    await order.save();
    console.log("Order Saved:", order);

    
    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderDetails: order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
});



router.post('/verify-payment', authenticateUser, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const userId = req.userId;

    console.log('Verify Payment Request Body:', req.body);
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    
    const generatedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    console.log('Generated Signature:', generatedSignature);
    console.log('Provided Signature:', razorpaySignature);

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature. Payment verification failed.' });
    }

   
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    console.log('Fetched Payment:', payment);

    if (payment.status !== 'captured') {
      return res.status(400).json({ message: 'Payment not captured. Payment verification failed.' });
    }

    
    const order = await Order.findOne({ razorpayOrderId });
    console.log('Fetched Order:', order);

    if (!order) {
      return res.status(400).json({ message: 'Order not found.' });
    }

    order.status = 'Completed';
    order.paymentStatus = 'Success';  
    await order.save();
    console.log('Updated Order:', order);

    
    const cart = await Cart.findOne({ userId });
    const wishlistCart = await WishlistCart.find({ userId });

    if (cart) {
      cart.products = [];
      await cart.save();
      console.log('Cleared Cart:', cart);
    }
    if (wishlistCart) {
      await WishlistCart.deleteMany({ userId });
      console.log('Cleared WishlistCart:', wishlistCart);
    }

    res.status(200).json({ message: 'Payment successful, order completed.' });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;


