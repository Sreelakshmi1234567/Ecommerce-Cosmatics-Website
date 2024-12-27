import React, { useEffect, useState } from "react";
import './WishlistPage.css';
import Navbar from "../components/Navbar"; 
function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAlertMessage('Please log in to view your wishlist.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data); 
        } else {
          setAlertMessage('Failed to fetch wishlist items.');
          console.error('Failed to fetch wishlist items');
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  
  const handleRemoveFromWishlist = async (productId, imagePath) => {
    const token = localStorage.getItem("token");
  
   
    console.log("Removing product from wishlist:", productId, imagePath);
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imagePath }), 
        }
      );
  
      if (response.ok) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        setAlertMessage("Product removed from wishlist.");
        setTimeout(() => setAlertMessage(""), 1000);
      } else {
        setAlertMessage('Failed to remove product from wishlist.');
        console.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };
  

  
  
  const handleAddToCart = async (productId, imagePath, brand, name, price) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setAlertMessage('Please log in to add products to the cart.');
      return;
    }
  
    
    console.log("Adding to cart:", { productId, imagePath, brand, name, price });
  
    try {
      const response = await fetch('http://localhost:5000/api/wishlist/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, imagePath, brand, name, price }), 
      });
  
      if (response.ok) {
        const data = await response.json();
        setAlertMessage(data.message); 
        console.log('Product added to cart:', data);
       
        setTimeout(() => setAlertMessage(''), 1000); 
      } else {
        const errorData = await response.json();
        setAlertMessage(errorData.error || 'Failed to add product to cart.');
        console.error('Failed to add product to cart:', errorData.error);
        setTimeout(() => setAlertMessage(''), 1000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAlertMessage('An error occurred while adding to cart.');
      setTimeout(() => setAlertMessage(''), 1000); 
    }
  };
  
  return (
    <>
      <div className="wishlist-navbar">
        <Navbar />
      </div>

<div className="wishlist-container"> 
      {alertMessage && (
        <div className="wishlist-alert">
          {alertMessage}
        </div>
      )}

      <h1 className="wishlist-heading">Your Wishlist</h1>

      <div className="wishlist-items">
        {wishlistItems.map((item) => (
          <div
            key={item._id}
            className="wishlist-item"
          >
            <img
              src={`http://localhost:5000/${item.imagePath}`}
              alt={item.name}
              className="wishlist-item-image"
            />
            <h3 className="wishlist-item-name">{item.name}</h3>
            <p className="wishlist-item-brand">{item.brand}</p>
            <div className="wishlist-buttons">
              <button
                onClick={() => handleAddToCart(item.productId, item.imagePath, item.brand, item.name, item.price)}
                className="wishlist-button"
              >
                Add to Cart
              </button>

              <button
                onClick={() => handleRemoveFromWishlist(item.productId, item.imagePath)}
                className="wishlist-remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default WishlistPage;