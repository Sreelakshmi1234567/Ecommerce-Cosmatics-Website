const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const NykaProduct = require('../models/nykaProduct'); // Adjust paths as needed
const MacProduct = require('../models/macProduct');
const LorealProduct = require('../models/lorealProduct');
const MaybellineProduct = require('../models/maybellineProduct');
const LakmeProduct = require('../models/lakmeProduct');
const KayProduct = require('../models/kayProduct');
const HudaProduct = require('../models/hudaProduct');
const ColorProduct = require('../models/colorProduct');
const CatCart = require('../models/Catcart');

router.post('/catcart', authenticateUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId

  try {
    let product =
      await NykaProduct.findById(productId).select('name price imagePath') ||
      await MacProduct.findById(productId).select('name price imagePath') ||
      await LorealProduct.findById(productId).select('name price imagePath') ||
      await MaybellineProduct.findById(productId).select('name price imagePath') ||
      await LakmeProduct.findById(productId).select('name price imagePath') ||
      await KayProduct.findById(productId).select('name price imagePath') ||
      await HudaProduct.findById(productId).select('name price imagePath') ||
      await ColorProduct.findById(productId).select('name price imagePath');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await CatCart.findOne({ userId });
    if (!cart) {
      cart = new CatCart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        price: product.price,
        imagePath: product.imagePath,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
});

module.exports = router;
