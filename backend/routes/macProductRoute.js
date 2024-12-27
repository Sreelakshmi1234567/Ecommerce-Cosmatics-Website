const express = require('express');
const multer = require('multer');
const MacProduct = require('../models/macProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// GET all products
router.get('/macproduct', async (req, res) => {
  try {
    const products = await MacProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching MAC products' });
  }
});

// POST a new product
router.post('/macproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const product = new MacProduct({
      name,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding MAC product' });
  }
});

// PUT (update) a product
router.put('/macproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await MacProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating MAC product' });
  }
});

// DELETE a product
router.delete('/macproduct/:id', async (req, res) => {
  try {
    await MacProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'MAC product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting MAC product' });
  }
});

module.exports = router;
