const express = require('express');
const multer = require('multer');
const LakmeProduct = require('../models/lakmeProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// GET all products
router.get('/lakmeproduct', async (req, res) => {
  try {
    const products = await LakmeProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Lakme products' });
  }
});

// POST a new product
router.post('/lakmeproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const product = new LakmeProduct({
      name,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Lakme product' });
  }
});

// PUT (update) a product
router.put('/lakmeproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await LakmeProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Lakme product' });
  }
});

// DELETE a product
router.delete('/lakmeproduct/:id', async (req, res) => {
  try {
    await LakmeProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lakme product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Lakme product' });
  }
});

module.exports = router;
