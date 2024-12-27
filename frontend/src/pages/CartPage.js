

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchCombinedCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/allcart/combined-cart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Combined Cart Response:", response.data);

      if (response.data && response.data.products) {
        const combinedCartItems = response.data.products;

        console.log(
          "Combined Cart Items before processing:",
          combinedCartItems
        );

        const validatedItems = combinedCartItems.map((item) => {
          console.log("Processing item:", item);

          return {
            ...item,
            quantity: item.quantity || 1,
            productDetails: {
              ...item.productDetails,
              name: item.productDetails?.name || item.name,
              price: item.productDetails?.price || item.price,
              imagePath: item.productDetails?.imagePath || item.imagePath,
            },
          };
        });

        console.log("Validated Combined Cart Items:", validatedItems);

        setCartItems(validatedItems.filter((item) => !item.isWishlist));
        setWishlistItems(validatedItems.filter((item) => item.isWishlist));
        calculateTotal(validatedItems);
      } else {
        console.warn("No products found in combined cart response");
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching combined cart items:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.productDetails.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleQuantityChange = async (productId, brand, quantity, isWishlist = false) => {
    if (quantity < 1) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/allcart/combined-cart/update",
        { productId, brand, quantity, isWishlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      
      fetchCombinedCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error.message);
    }
  };
  
  

  const handleRemoveItem = async (productId, brand, isWishlist = false) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "http://localhost:5000/api/allcart/combined-cart/delete",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId, brand, isWishlist },
        }
      );
  
      
      fetchCombinedCartItems();
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error.message);
    }
  };
  

  const handleBuyNow = () => {
    navigate("/user-payment");
  };

  useEffect(() => {
    fetchCombinedCartItems();
  }, []);

  if (loading) return <p className="cartpage-loading">Loading cart...</p>;

  if (cartItems.length === 0 && wishlistItems.length === 0)
    return <p className="cartpage-empty">Your cart is empty.</p>;

  return (
    <div className="cartpage-container">
      <h2 className="cartpage-title">Your Cart</h2>

      <ul className="cartpage-items">
        {cartItems.map((item) => (
          <li key={item.productId} className="cartpage-item">
            <div className="cartpage-item-content">
              {item.productDetails ? (
                <>
                  <img
                    src={`http://localhost:5000/${item.productDetails.imagePath}`}
                    alt={item.productDetails.name}
                    className="cartpage-item-image"
                  />
                  <div className="cartpage-item-details">
                    <h3 className="cartpage-item-name">
                      {item.productDetails.name}
                    </h3>
                    <p className="cartpage-item-brand">Brand: {item.brand}</p>
                    <p className="cartpage-item-price">
                      Price: ₹{item.productDetails.price}
                    </p>
                    <p className="cartpage-item-quantity">
                      Quantity: {item.quantity}
                    </p>
                    <div className="cartpage-item-actions">
                      <button
                        className="cartpage-button"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.brand,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <button
                        className="cartpage-button"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.brand,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="cartpage-button cartpage-button-remove"
                        onClick={() =>
                          handleRemoveItem(item.productId, item.brand)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="cartpage-item-missing">
                  Product details are missing.
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ul className="cartpage-items">
  {wishlistItems.map((item) => (
    <li key={item.productId} className="cartpage-item">
      <div className="cartpage-item-content">
        {item.productDetails ? (
          <>
            <img
              src={`http://localhost:5000/${item.productDetails.imagePath}`}
              alt={item.productDetails.name}
              className="cartpage-item-image"
            />
            <div className="cartpage-item-details">
              <h3 className="cartpage-item-name">
                {item.productDetails.name}
              </h3>
              <p className="cartpage-item-brand">Brand: {item.brand}</p>
              <p className="cartpage-item-price">
                Price: ₹{item.productDetails.price}
              </p>
              <p className="cartpage-item-quantity">
                Quantity: {item.quantity}
              </p>
              <div className="cartpage-item-actions">
                <button
                  className="cartpage-button"
                  onClick={() =>
                    handleQuantityChange(item.productId, item.brand, item.quantity - 1, true)
                  }
                >
                  -
                </button>
                <button
                  className="cartpage-button"
                  onClick={() =>
                    handleQuantityChange(item.productId, item.brand, item.quantity + 1, true)
                  }
                >
                  +
                </button>
                <button
                  className="cartpage-button cartpage-button-remove"
                  onClick={() => handleRemoveItem(item.productId, item.brand, true)}
                >
                  Remove
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="cartpage-item-missing">Product details are missing.</p>
        )}
      </div>
    </li>
  ))}
</ul>


      <div className="cartpage-price-details">
        <h3 className="cartpage-price-title">Price Details</h3>
        <ul className="cartpage-price-list">
          <li>
            <span>
              Bag MRP ({cartItems.length + wishlistItems.length} items)
            </span>
            <span>₹{Math.round(totalAmount)}</span>
          </li>
         
          <li>
            <span>Shipping</span>
            <span style={{ color: "green" }}>Free</span>
          </li>
        </ul>
        <h3 className="cartpage-price-total">
          <span>You Pay</span>
          <span>₹{Math.round(totalAmount)}</span>
        </h3>
      </div>

      <button
        className="cartpage-buy-now-button"
        onClick={handleBuyNow}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Proceed"}
      </button>
    </div>
  );
};

export default CartPage;
