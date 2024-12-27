const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const ProfileAddress = require('../models/ProfileAddress');
const Cart = require('../models/Cart');
const WishlistCart = require('../models/WishlistCart');
const authenticateUser = require('../middleware/authenticateUser');


router.post('/ordercreate', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    
    
    const userAddress = await ProfileAddress.findOne({ userId });
    if (!userAddress) {
      return res.status(400).json({ message: 'User address not found' });
    }

    
    const cart = await Cart.findOne({ userId }).populate('items.productDetails');
    const wishlistCart = await WishlistCart.findOne({ userId }).populate('items.productDetails');

    const combinedItems = [
      ...(cart ? cart.items : []), 
      ...(wishlistCart ? wishlistCart.items : [])
    ];

    if (combinedItems.length === 0) {
      return res.status(400).json({ message: 'Both cart and wishlist are empty' });
    }

   
    const totalAmount = combinedItems.reduce(
      (acc, item) => acc + item.productDetails.price * item.quantity,
      0
    );

   
    const order = new Order({
      userId,
      items: combinedItems.map((item) => ({
        productId: item.productDetails._id,
        quantity: item.quantity,
        imagePath: item.productDetails.imagePath,
        name: item.productDetails.name,
        price: item.productDetails.price,
      })),
      totalAmount,
      address: userAddress, 
      paymentStatus: 'Pending',  
      paymentMethod: 'Razorpay',  
    });

    
    await order.save();

    res.status(201).json({
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/orderget', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

  
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      deliveryStatus: order.status,
      products: order.items.map((item) => ({
        productId: item.productId, 
        productDetails: {
          name: item.name,
          price: item.price,
          imagePath: item.imagePath,
        },
        quantity: item.quantity,
      })),
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});





router.put('/orders/:razorpayOrderId', authenticateUser, async (req, res) => {
  try {
    const { razorpayOrderId } = req.params;
    const { paymentStatus } = req.body;

    
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    
    order.paymentStatus = paymentStatus;
    await order.save();

    console.log('Updated Order:', order);

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});




router.get('/adminorder', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId'); 

    const ordersWithAddresses = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).populate('addresses');
        const address = user.addresses.length > 0 ? user.addresses[0] : null; 
        return { ...order.toObject(), userAddress: address };
      })
    );

    res.status(200).json(ordersWithAddresses);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});



router.put('/adminorders/:orderId', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

  
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

   
    order.status = status;
    await order.save();

    console.log('Updated Order:', order);

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



router.post('/cashorder', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { address, paymentStatus, paymentMethod, totalAmount, items } = req.body;

    
    if (!address || !paymentStatus || !paymentMethod || !totalAmount || !items || items.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    const order = new Order({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        imagePath: item.imagePath,
        name: item.name,
        price: item.price,
      })),
      totalAmount,
      address,  
      paymentStatus,  
      paymentMethod,  
    });

    
    await order.save();

    console.log("Order Created:", order);

    res.status(201).json({
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
















 


