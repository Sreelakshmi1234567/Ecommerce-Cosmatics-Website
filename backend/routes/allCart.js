const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const Cart = require('../models/Cart');
const WishlistCart = require('../models/WishlistCart');
const router = express.Router();

router.get('/combined-cart', authenticateUser, async (req, res) => {
    const { userId } = req;
  
    try {
      
      const cart = await Cart.findOne({ userId });
  
     
      const wishlistCart = await WishlistCart.find({ userId });
  
     
      const cartItems = cart && cart.products ? cart.products : [];
      const wishlistCartItems = wishlistCart && Array.isArray(wishlistCart) ? wishlistCart : [];
  
      
      const combinedCartItems = [...cartItems, ...wishlistCartItems];
  
     
      console.log("Combined Cart Items:", combinedCartItems);
  
      if (combinedCartItems.length === 0) {
        return res.status(404).json({ message: 'No items found in either cart or wishlist' });
      }
  
      
      res.status(200).json({ products: combinedCartItems });
    } catch (error) {
      console.error('Error fetching combined cart items:', error);
      res.status(500).json({ message: 'Error fetching combined cart items', error });
    }
});



router.put('/combined-cart/update', authenticateUser, async (req, res) => {
  const { userId } = req;
  const { productId, brand, quantity } = req.body;

  try {
    console.log(`Update Cart Request - User: ${userId}, Product: ${productId}, Brand: ${brand}, Quantity: ${quantity}`);

    
    const cart = await Cart.findOne({ userId });
    if (cart) {
      console.log('Found Cart:', cart);

      const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId && item.brand === brand);
      if (itemIndex !== -1) {
        console.log(`Found Cart Item at Index: ${itemIndex}`);

      
        cart.products[itemIndex].quantity = quantity;
        await cart.save();

        console.log('Updated Cart Item:', cart.products[itemIndex]);

      
        const updatedCartItems = cart.products;
        const updatedWishlistCart = await WishlistCart.find({ userId });

        const combinedCartItems = [
          ...updatedCartItems,
          ...updatedWishlistCart,
        ];

        return res.status(200).json({ products: combinedCartItems });
      } else {
        console.error('Cart item not found');
        console.log(`Available Cart Items: ${JSON.stringify(cart.products)}`);
      }
    } else {
      console.error('Cart not found');
    }

   
    const wishlistCart = await WishlistCart.findOneAndUpdate(
      { userId, productId, brand },
      { $set: { quantity } },
      { new: true }
    );

    if (!wishlistCart) {
      console.error('Wishlist item not found');
      return res.status(404).json({ message: 'Item not found in both cart and wishlist' });
    }

    console.log('Updated Wishlist Item:', wishlistCart);

    
    const updatedWishlistCart = await WishlistCart.find({ userId });
    const updatedCartItems = cart ? cart.products : [];

    const combinedCartItems = [
      ...updatedCartItems,
      ...updatedWishlistCart,
    ];

    res.status(200).json({ products: combinedCartItems });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error });
  }
});

router.delete('/combined-cart/delete', authenticateUser, async (req, res) => {
  const { userId } = req;
  const { productId, brand } = req.body;

  try {
    console.log(`Delete Request - User: ${userId}, Product: ${productId}, Brand: ${brand}`);

    
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId, brand } } },
      { new: true }
    );

    let updatedCartItems = [];
    if (cart) {
      console.log('Deleted Cart Item:', cart);
      updatedCartItems = cart.products;
    } else {
      console.error('Cart item not found in cart');
    }

    
    const wishlistCart = await WishlistCart.findOneAndDelete({ userId, productId, brand });

    if (!wishlistCart && !cart) {
      console.error('Wishlist item not found');
      return res.status(404).json({ message: 'Item not found in both cart and wishlist' });
    }

    console.log('Deleted Wishlist Item:', wishlistCart);

  
    const updatedWishlistCart = await WishlistCart.find({ userId });

    const combinedCartItems = [
      ...updatedCartItems,
      ...updatedWishlistCart,
    ];

    res.status(200).json({ products: combinedCartItems });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'Error deleting cart item', error });
  }
});

module.exports = router;




