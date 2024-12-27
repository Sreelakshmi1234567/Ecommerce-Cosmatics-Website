const express = require('express');
const multer = require('multer');
const LorealProduct = require('../models/lorealProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// GET all products
router.get('/lorealproduct', async (req, res) => {
  try {
    const products = await LorealProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching L\'Oreal products' });
  }
});

// POST a new product
router.post('/lorealproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const product = new LorealProduct({
      name,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding L\'Oreal product' });
  }
});

// PUT (update) a product
router.put('/lorealproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await LorealProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating L\'Oreal product' });
  }
});

// DELETE a product
router.delete('/lorealproduct/:id', async (req, res) => {
  try {
    await LorealProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'L\'Oreal product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting L\'Oreal product' });
  }
});

module.exports = router;
