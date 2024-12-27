const express = require('express');
const multer = require('multer');
const NykaProduct = require('../models/nykaProduct');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



const formatProductName = (name) => {
  const words = name.split(" ");
  let formattedName = "";
  let line = "";

  words.forEach((word) => {
    if ((line + word).length > 15) { 
      formattedName += line.trim() + "\n";
      line = "";
    }
    line += word + " ";
  });

  formattedName += line.trim();
  
  const lines = formattedName.split("\n");
  if (lines.length > 3) {
    formattedName = lines.slice(0, 3).join("\n");
  }

  return formattedName;
};




// GET all products
router.get('/nykaproduct', async (req, res) => {
  try {
    const products = await NykaProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Nykaa products' });
  }
});

// POST a new product
router.post('/nykaproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const formattedName = formatProductName(name);
    const price = mrp - (mrp * discount) / 100;
    const product = new NykaProduct({
      name: formattedName,
      mrp,
      discount,
      price,
      imagePath: req.file.path,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Nykaa product' });
  }
});

// PUT (update) a product
router.put('/nykaproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, mrp, discount } = req.body;
    const price = mrp - (mrp * discount) / 100;
    const updatedData = { name, mrp, discount, price };
    if (req.file) updatedData.imagePath = req.file.path;

    const updatedProduct = await NykaProduct.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Nykaa product' });
  }
});

// DELETE a product
router.delete('/nykaproduct/:id', async (req, res) => {
  try {
    await NykaProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nykaa product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Nykaa product' });
  }
});

module.exports = router;
