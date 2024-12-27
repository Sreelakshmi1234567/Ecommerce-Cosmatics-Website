const mongoose = require('mongoose');

const profileAddressSchema = new mongoose.Schema({
  label: String, 
  name: String, 
  street: String, 
  city: String, 
  state: String, 
  landmark: String, 
  pincode: String, 
  country: String, 
  phone: String, 
});

const ProfileAddress = mongoose.model('ProfileAddress', profileAddressSchema);
module.exports = ProfileAddress;
