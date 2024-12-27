const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ProfileAddress = require("../models/ProfileAddress"); 
const router = express.Router();


const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied: No Token Provided");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user; 
    next();
  });
};
router.post("/addresses", authenticateToken, async (req, res) => {
  console.log("Authenticated User:", req.user); 
  try {
    const { label, name, street, city, state, landmark, pincode, country, phone } = req.body;

   
    if (!label || !name || !street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    
    const user = await User.findById(userId); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const newAddress = new ProfileAddress({
      label,
      name,
      street,
      city,
      state,
      landmark,
      pincode,
      country,
      phone,
      user: userId, 
    });

    
    await newAddress.save();

    
    user.addresses.push(newAddress._id); 
    await user.save();

    res.status(201).json(newAddress); 
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Server error" });
  }
});





router.get("/profileaddress", authenticateToken, async (req, res) => {
  try {
    console.log("Authenticated User ID:", req.user.userId); // Log user ID
    const user = await User.findById(req.user.userId).populate("addresses");
    if (!user) {
      console.log("User not found in database");
      return res.status(404).send("User not found");
    }
    console.log("User found:", user);
    res.json(user);
  } catch (err) {
    console.error("Error in /profileaddress route:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/addresses/:id", authenticateToken, async (req, res) => {
  try {
    const { label, name, street, city, state, landmark, pincode, country, phone } = req.body;

    
    if (!label || !name || !street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const address = await ProfileAddress.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    
    address.label = label;
    address.name = name;
    address.street = street;
    address.city = city;
    address.state = state;
    address.landmark = landmark;
    address.pincode = pincode;
    address.country = country;
    address.phone = phone;

 
    await address.save();

    res.json(address); 
  } catch (err) {
    console.error("Error editing address:", err);
    res.status(500).json({ error: "Server error" });
  }
});







 

router.delete("/addresses/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    if (!user) return res.status(404).send("User not found");

   
    user.addresses = user.addresses.filter(
      (addressId) => addressId.toString() !== req.params.id
    );

    await user.save(); 

   
    await ProfileAddress.findByIdAndDelete(req.params.id);

    res.json({ message: "Address removed successfully", user });
  } catch (err) {
    console.error("Error removing address:", err);
    res.status(500).json({ error: "Server error" });
  }
});


  module.exports = router;
  
