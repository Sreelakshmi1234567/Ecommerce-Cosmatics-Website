const express = require('express');
const multer = require('multer');
const HudaProduct = require('../models/hudaProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// GET all products
router.get('/hudaproduct', async (req, res) => {
  try {
    const products = await HudaProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Huda products' });
  }
});

// POST a new product
router.post('/hudaproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const product = new HudaProduct({
      name,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Huda product' });
  }
});

// PUT (update) a product
router.put('/hudaproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await HudaProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Huda product' });
  }
});

// DELETE a product
router.delete('/hudaproduct/:id', async (req, res) => {
  try {
    await HudaProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Huda product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Huda product' });
  }
});

module.exports = router;
