import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Navbar from '../components/Navbar'
import Footer from "./Footer";


function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    label: "",
    name: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
    country: "",
    phone: "",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null); 

  
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await axios.get(
        "http://localhost:5000/api/address/profileaddress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User fetched successfully:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    console.log("Form data to be posted:", newAddress);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/address/addresses",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        addresses: [...prevUser.addresses, response.data],
      }));
      setNewAddress({
        label: "",
        name: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        pincode: "",
        country: "",
        phone: "",
      });
      setIsAddingAddress(false);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    console.log("Updated address data to be posted:", newAddress);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/address/addresses/${addressToEdit._id}`,
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedAddresses = user.addresses.map((address) =>
        address._id === addressToEdit._id ? response.data : address
      );

      setUser({ ...user, addresses: updatedAddresses });
      setNewAddress({
        label: "",
        name: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        pincode: "",
        country: "",
        phone: "",
      });
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error editing address:", error);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/address/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedAddresses = user.addresses.filter(
        (address) => address._id !== addressId
      );

      setUser({ ...user, addresses: updatedAddresses });
    } catch (error) {
      console.error("Error removing address:", error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="profile-page">
      
      <div className="profile-sidebar">
        <ul className="profile-menu">
          <li className="active">
            <a href="/profile">
              <i className="fa-solid fa-user"></i> My Profile
            </a>
          </li>
          <li>
            <a href="/orders">
              <i className="fa-solid fa-box"></i> My Orders
            </a>
          </li>
          <li>
            <a href="/wishlist">
              <i className="fa-solid fa-heart"></i> My Wishlist
            </a>
          </li>
          <li>
            <a href="/login">
              <i className="fa-solid fa-power-off"></i> Log Out
            </a>
          </li>
        </ul>
      </div>

      <div className="profile-content">
        {loading ? (
          <div>Loading...</div> 
        ) : (
          user && (
            <div className="profile-details">
              <h2>{user.username}</h2>
              <p>Email: {user.email}</p>
          
            </div>
          )
        )}
    

      <div className="profile-address">
        <h3>MY ADDRESS</h3>
        {user && user.addresses && user.addresses.length > 0 ? (
          user.addresses.map((address, index) => (
            <div className="address-card" key={index}>
              <h4>{address.label || "Address"}</h4>
              <p>
                {address.name}
                <br />
                {address.street}, {address.city}, {address.state}
                <br />
                Landmark: {address.landmark || "None"}
                <br />
                {address.pincode}, {address.country}
                <br />
                {address.phone}
              </p>
              <div className="address-actions">
                <button
                  onClick={() => {
                    setIsEditingAddress(true);
                    setAddressToEdit(address);
                    setNewAddress(address);
                  }}
                  className="edit-address"
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
                <button
                  onClick={() => handleRemoveAddress(address._id)}
                  className="remove-address"
                >
                  <i className="fa-solid fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses added yet.</p>
        )}
        <button
          className="add-address-link"
          onClick={() => setIsAddingAddress(true)}
        >
          <i className="fa-solid fa-plus"></i> Add New Address
        </button>
        {(isAddingAddress || isEditingAddress) && (
          <div className="address-form">
            <h3>{isEditingAddress ? "Edit Address" : "Add New Address"}</h3>
            <form
              onSubmit={isEditingAddress ? handleEditAddress : handleAddAddress}
            >
              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  name="label"
                  value={newAddress.label}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleAddressChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleAddressChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn-submit">
                  {isEditingAddress ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAddress(false);
                    setIsEditingAddress(false);
                    setNewAddress({
                      label: "",
                      name: "",
                      street: "",
                      city: "",
                      state: "",
                      landmark: "",
                      pincode: "",
                      country: "",
                      phone: "",
                    });
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    
    </div>

    <div className="profooter">
    <Footer/>
    </div>
    </>
  );
}

export default Profile;
