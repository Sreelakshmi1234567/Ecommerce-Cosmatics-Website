const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const Wishlist = require('../models/Wishlist');
const WishlistCart = require('../models/WishlistCart');
const NykaProduct = require('../models/nykaProduct');
const MacProduct = require('../models/macProduct');
const MaybellineProduct = require('../models/maybellineProduct');
const LorealProduct = require('../models/lorealProduct');
const LakmeProduct = require('../models/lakmeProduct');
const KayProduct =require('../models/kayProduct');
const HudaProduct = require('../models/hudaProduct');
const ColorProduct = require('../models/colorProduct');



router.post('/', authenticateUser, async (req, res) => {
  const { productId, name, imagePath, price, brand } = req.body;  
  const userId = req.userId; 

  
  const validBrands = [
    "nykaProduct",
    "macProduct",
    "maybellineProduct",
    "lorealProduct",
    "lakmeProduct",
    "kayProduct",
    "hudaProduct",
    "colorProduct",
  ];

  
  if (!productId || !name || !imagePath || !price || !brand) {  
    return res.status(400).json({ message: 'All fields are required (productId, name, imagePath, price, brand).' });
  }

  
  if (!validBrands.includes(brand)) {
    return res.status(400).json({ message: 'Invalid brand.' });
  }

  try {
    
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });

    if (existingWishlistItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    
    const newWishlistItem = new Wishlist({ userId, productId, name, imagePath, price, brand });
    await newWishlistItem.save();

    res.status(201).json({ message: 'Product added to wishlist', wishlistItem: newWishlistItem });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', authenticateUser, async (req, res) => {
  const userId = req.userId;

  try {
    
    const wishlistItems = await Wishlist.find({ userId })
      .populate('productId', 'name imagePath price'); 

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.delete('/:productId', authenticateUser, async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;
  const { imagePath } = req.body; 

 
  console.log("Removing product from wishlist:", { userId, productId, imagePath });

  try {
    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

   
   

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/add-to-cart', authenticateUser, async (req, res) => {
  try {
    const { productId, imagePath, brand,name, price } = req.body; 
    const userId = req.userId;

    if (!productId || !imagePath || !brand || !name || !price) {
      return res.status(400).json({ error: 'Product ID, imagePath, brand and name are required' });
    }

   
    const wishlistItem = await Wishlist.findOne({ userId, productId });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    
    if (wishlistItem.brand !== brand) {
      return res.status(400).json({ error: 'Brand mismatch. Cannot add to cart.' });
    }

    
    const existingCartItem = await WishlistCart.findOne({ userId, productId });
    if (existingCartItem) {
      return res.status(400).json({ error: 'Product already in cart' });
    }

    
    const cartItem = new WishlistCart({
      userId,
      productId,
      imagePath, 
      brand, 
      name,
      price,    
    });

    await cartItem.save();
    res.status(200).json({ message: 'Product added to cart successfully', cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/wishlistcart', authenticateUser, async (req, res) => {
  const { userId } = req; 

  try {
   
    const wishlistCartItems = await WishlistCart.find({ userId });

    if (wishlistCartItems.length === 0) {
      return res.status(404).json({ message: 'Wishlist cart is empty' });
    }

    
    const formattedWishlistCartItems = await Promise.all(
      wishlistCartItems.map(async (item) => {
        let productDetails = null;
        let brandModel;

        
        switch (item.brand) {
          case 'nykaProduct':
            brandModel = NykaProduct;
            break;
          case 'macProduct':
            brandModel = MacProduct;
            break;
          case 'lorealProduct':
            brandModel = LorealProduct;
            break;
          case 'maybellineProduct':
            brandModel = MaybellineProduct;
            break;
          case 'kayProduct':
            brandModel = KayProduct;
            break;
          case 'hudaProduct':
            brandModel = HudaProduct;
            break;
          case 'colorProduct':
            brandModel = ColorProduct;
            break;
          case 'lakmeProduct':
            brandModel = LakmeProduct;
            break;
          default:
            console.log(`Unknown brand: ${item.brand}`);
            return null;  
        }

        if (brandModel) {
         
          productDetails = await brandModel.findById(item.productId).select('name price imagePath brand');
          console.log('Product details:', productDetails);
        }

       
        if (productDetails) {
          return {
            ...item._doc,
            productDetails:{
           
            name: productDetails.name,
            quantity: item.quantity,  
            brand: item.brand, 
            price: productDetails.price,
            imagePath: productDetails.imagePath,
           } 
          };
        }

        console.log(`Product ${item.productId} missing details`);
        return null; 
      })
    );

    
    const populatedProducts = formattedWishlistCartItems.filter(item => item !== null);

    res.status(200).json({ products: populatedProducts });
  } catch (error) {
    console.error('Error fetching wishlist cart:', error);
    res.status(500).json({ message: 'Error fetching wishlist cart', error });
  }
});




router.put('/wishlistcartupdate', authenticateUser, async (req, res) => {
  try {
    const { productId, brand, quantity } = req.body;
    const userId = req.userId;

    
    if (!productId || !brand || !quantity) {
      return res.status(400).json({ error: 'Product ID, brand, and quantity are required' });
    }

    
    const validBrands = ['nykaProduct', 'macProduct', 'lorealProduct', 'maybellineProduct', 'kayProduct', 'hudaProduct', 'colorProduct', 'lakmeProduct'];

   
    if (!validBrands.includes(brand)) {
      return res.status(400).json({ error: 'Invalid brand' });
    }

   
    console.log("Received data for update:", { productId, brand, quantity, userId });

   
    let brandModel;
    switch (brand) {
      case 'nykaProduct':
        brandModel = NykaProduct;
        break;
      case 'macProduct':
        brandModel = MacProduct;
        break;
      case 'lorealProduct':
        brandModel = LorealProduct;
        break;
     
      default:
        return res.status(400).json({ error: 'Invalid brand' });
    }

    
    const wishlistCartItem = await WishlistCart.findOneAndUpdate(
      { userId, productId },
      { $set: { quantity } },
      { new: true }
    );

    if (!wishlistCartItem) {
      return res.status(404).json({ error: 'Product not found in wishlist cart' });
    }

    
    const updatedWishlistCartItems = await WishlistCart.find({ userId })
      .populate('productId', null, brandModel); 
    
    res.status(200).json({ products: updatedWishlistCartItems });
  } catch (error) {
    console.error('Error updating wishlist cart item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.delete('/wishlistcart/:productId', authenticateUser, async (req, res) => {
  const { productId } = req.params;
  const { brand } = req.query; 
  const { userId } = req; 

  try {
    
    const validBrands = [
      'nykaProduct',
      'macProduct',
      'lorealProduct',
      'maybellineProduct',
      'kayProduct',
      'hudaProduct',
      'colorProduct',
      'lakmeProduct',
    ];

    if (!validBrands.includes(brand)) {
      return res.status(400).json({ message: 'Invalid brand' });
    }

  
    const wishlistCartItem = await WishlistCart.findOneAndDelete({ userId, productId, brand });

    if (!wishlistCartItem) {
      return res.status(404).json({ message: 'Product not found in wishlist cart' });
    }

    const updatedWishlistCartItems = await WishlistCart.find({ userId });
    res.status(200).json({ message: 'Product removed from wishlist cart', products: updatedWishlistCartItems });
  } catch (error) {
    console.error('Error removing product from wishlist cart:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});



module.exports = router;


