const express = require('express');
const multer = require('multer');
const ColorProduct = require('../models/colorProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// GET all products
router.get('/colorproduct', async (req, res) => {
  try {
    const products = await ColorProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Color products' });
  }
});

// POST a new product
router.post('/colorproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const product = new ColorProduct({
      name,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Color product' });
  }
});

// PUT (update) a product
router.put('/colorproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await ColorProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Color product' });
  }
});

// DELETE a product
router.delete('/colorproduct/:id', async (req, res) => {
  try {
    await ColorProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Color product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Color product' });
  }
});

module.exports = router;
