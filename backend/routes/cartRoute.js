const express = require('express');

const Cart = require('../models/Cart');

const NykaProduct = require('../models/nykaProduct');
const MaybellineProduct = require('../models/maybellineProduct');
const MacProduct = require('../models/macProduct');
const LorealProduct = require('../models/lorealProduct');
const LakmeProduct = require('../models/lakmeProduct');
const KayProduct =require('../models/kayProduct');
const HudaProduct = require('../models/hudaProduct');
const ColorProduct = require('../models/colorProduct');

const authenticateUser = require('../middleware/authenticateUser')

const router = express.Router();


router.post('/', authenticateUser, async (req, res) => {
    const { brand, productId, quantity, } = req.body;
    const userId  = req.userId;
  
    try {
      let product;
  
      
      if (brand === 'nykaProduct') {
        product = await NykaProduct.findById(productId).select('name price imagePath');
      } else if (brand === 'macProduct') {
        product = await MacProduct.findById(productId);
      } else if (brand === 'lorealProduct') {
        product = await LorealProduct.findById(productId).select('name price imagePath');
      } else if (brand === 'maybellineProduct') {
        product = await MaybellineProduct.findById(productId).select('name price imagePath');
      } else if (brand=== 'lakmeProduct'){
        product = await LakmeProduct.findById(productId).select('name price imagePath')
      }else if (brand=== 'kayProduct'){
        product = await KayProduct.findById(productId).select('name price imagePath')
      }else if (brand=== 'hudaProduct'){
        product = await HudaProduct.findById(productId).select('name price imagePath')
      }else if (brand=== 'colorProduct'){
        product = await ColorProduct.findById(productId).select('name price imagePath')
      }else {
        
        console.error('Brand not recognized');
        product = null;
      }
      

      console.log('Fetched Product Image Path:', product.imagePath);
      
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }
  
      
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId && item.brand === brand
      );
  
      if (productIndex > -1) {
       
        cart.products[productIndex].quantity += quantity;
      } else {
       
        cart.products.push({
          brand,
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
  router.get('/', authenticateUser, async (req, res) => {
    const { userId } = req; 
  
    try {
      
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.products.length === 0) {
        return res.status(404).json({ message: 'Cart is empty' });
      }
  
      
      const populatedProducts = await Promise.all(
        cart.products.map(async (item) => {
          let productDetails;
  
       
          if (item.brand === 'nykaProduct') {
            productDetails = await NykaProduct.findById(item.productId).select('name price imagePath');
          } else if (item.brand === 'macProduct') {
            productDetails = await MacProduct.findById(item.productId).select('name price imagePath');
          } else if (item.brand === 'maybellineProduct') {
            productDetails = await MaybellineProduct.findById(item.productId).select('name price imagePath');
          }else if (item.brand === 'lorealProduct') {
            productDetails = await LorealProduct.findById(item.productId).select('name price imagePath');
          }else if (item.brand === 'lakmeProduct') {
            productDetails = await LakmeProduct.findById(item.productId).select('name price imagePath');
          }else if (item.brand === 'kayProduct') {
            productDetails = await KayProduct.findById(item.productId).select('name price imagePath');
          }else if (item.brand === 'hudaProduct') {
            productDetails = await HudaProduct.findById(item.productId).select('name price imagePath');
          }else if (item.brand === 'colorProduct') {
            productDetails = await ColorProduct.findById(item.productId).select('name price imagePath');
          }


          console.log('Populated Product Image Path:', productDetails?.imagePath);
         
  
          if (productDetails) {
            return {
              ...item._doc,
             productDetails:{
              name: productDetails.name, 
              price: productDetails.price,
              imagePath: productDetails.imagePath,
              quantity: item.quantity, 
              brand: item.brand,
            }
            };
          }
  
          return null; 
        })
      );

  
     
      const filteredProducts = populatedProducts.filter((product) => product !== null);
  
      res.status(200).json({ products: filteredProducts });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Error fetching cart', error });
    }
  });



  router.put('/', authenticateUser, async (req, res) => {
    const { productId, quantity, brand } = req.body;
    const { userId } = req; 
  
    try {
      
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId && item.brand === brand
      );
  
      if (productIndex > -1) {
        
        cart.products[productIndex].quantity = quantity;
  
        
        if (quantity <= 0) {
          cart.products.splice(productIndex, 1);
        }
  
        await cart.save();
  
      
        const populatedProducts = await Promise.all(
          cart.products.map(async (item) => {
            let productDetails;
  
            if (item.brand === 'nykaProduct') {
              productDetails = await NykaProduct.findById(item.productId);
            } else if (item.brand === 'maybellineProduct') {
              productDetails = await MaybellineProduct.findById(item.productId);
            }else if (item.brand === 'macProduct') {
              productDetails = await MacProduct.findById(item.productId);
            }else if (item.brand === 'lorealProduct') {
              productDetails = await LorealProduct.findById(item.productId);
            }else if (item.brand === 'lakmeProduct') {
              productDetails = await LakmeProduct.findById(item.productId);
            }else if (item.brand === 'kayProduct') {
              productDetails = await KayProduct.findById(item.productId);
            }else if (item.brand === 'hudaProduct') {
              productDetails = await HudaProduct.findById(item.productId);
            }else if (item.brand === 'colorProduct') {
              productDetails = await ColorProduct.findById(item.productId);
            }

          
  
            if (productDetails) {
              return { ...item._doc, productDetails };
            }
            return null;
          })
        );
  
        const filteredProducts = populatedProducts.filter((product) => product !== null);
  
        return res.status(200).json({ message: 'Cart updated', products: filteredProducts });
      }
  
      res.status(404).json({ message: 'Product not found in cart' });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ message: 'Error updating cart', error });
    }
  });
  
  
  
  router.delete('/:productId', authenticateUser, async (req, res) => {
    const { productId } = req.params;
    const { brand } = req.body;  
    const { userId } = req;  
  
    try {
      
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      
      const updatedProducts = cart.products.filter(
        (item) => !(item.productId.toString() === productId && item.brand === brand)
      );
  
   
      if (updatedProducts.length === cart.products.length) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      
      cart.products = updatedProducts;
      await cart.save();
  
      
      const populatedProducts = await Promise.all(
        cart.products.map(async (item) => {
          let productDetails;
  
          
          switch (item.brand) {
            case 'nykaProduct':
              productDetails = await NykaProduct.findById(item.productId);
              break;
            case 'maybellineProduct':
              productDetails = await MaybellineProduct.findById(item.productId);
              break;
            case 'macProduct':
              productDetails = await MacProduct.findById(item.productId);
              break;
            case 'lorealProduct':
              productDetails = await LorealProduct.findById(item.productId);
              break;
            case 'lakmeProduct':
              productDetails = await LakmeProduct.findById(item.productId);
              break;
            case 'kayProduct':
              productDetails = await KayProduct.findById(item.productId);
              break;
            case 'hudaProduct':
              productDetails = await HudaProduct.findById(item.productId);
              break;
            case 'colorProduct':
              productDetails = await ColorProduct.findById(item.productId);
              break;
            default:
              break;
          }
  
          
          if (productDetails) {
            return { ...item._doc, productDetails };
          }
          return null;
        })
      );
  
      
      const filteredProducts = populatedProducts.filter((product) => product !== null);
  
     
      return res.status(200).json({ message: 'Product removed from cart', products: filteredProducts });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ message: 'Error removing product from cart', error });
    }
  });

  
  
  router.post('/catcart', authenticateUser, async (req, res) => {
    const { productId,brand , quantity } = req.body;
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
  
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products: [] });
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
  



  

