


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserPayment.css'

const UserPayment = () => {
  const [addresses, setAddresses] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/address/profileaddress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error.message);
    }
  };

  const fetchCartAndWishlistItems = async () => {
    try {
      const token = localStorage.getItem("token");

     
      const response = await axios.get("http://localhost:5000/api/allcart/combined-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const combinedItems = response.data.products || [];

      console.log("Combined Cart and Wishlist Items:", combinedItems);

      
      const cartItems = combinedItems.filter(item => !item.isWishlist);
      const wishlistItems = combinedItems.filter(item => item.isWishlist);

      
      setCartItems(cartItems);
      setWishlistItems(wishlistItems);

      console.log("Cart Items:", cartItems);
      console.log("Wishlist Items:", wishlistItems);

      
      const cartTotal = cartItems.reduce((acc, item) => {
        console.log('Cart Item:', item);
        console.log('Cart Item Price:', item.price);
        console.log('Cart Item Quantity:', item.quantity);
        return acc + (item.price * item.quantity);
      }, 0);

      const wishlistTotal = wishlistItems.reduce((acc, item) => {
        console.log('Wishlist Item:', item);
        console.log('Wishlist Item Price:', item.price);
        console.log('Wishlist Item Quantity:', item.quantity);
        return acc + (item.price * item.quantity);
      }, 0);

      const total = cartTotal + wishlistTotal;

      console.log("Total Amount Calculated:", total);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching cart and wishlist items:", error.message);
    }
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay SDK loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }
    if (!paymentMethod) {
      alert("Please choose a payment method.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const itemsWithDetails = [...cartItems, ...wishlistItems].map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        imagePath: item.imagePath,
        name: item.name,
      }));
  
      console.log("Items with Details for Order:", itemsWithDetails);
      console.log("Total Amount:", totalAmount);
      console.log("Selected Address:", selectedAddress);
      console.log("Payment Method:", paymentMethod);
  
      
      if (paymentMethod === "cash-on-delivery") {
        const response = await axios.post(
          "http://localhost:5000/api/order/cashorder",
          {
            address: selectedAddress,
            paymentStatus: "pending",
            paymentMethod,
            totalAmount,
            items: itemsWithDetails,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        console.log("Order Placed:", response.data);
        navigate("/order-success"); 
      }
  
      
      if (paymentMethod === "online-payment") {
        const res = await loadRazorpay();
  
        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }
  
        
        console.log("Request Payload for Payment:", {
          amount: totalAmount * 100,
          address: selectedAddress,
          paymentMethod,
        });
  
        const paymentResponse = await axios.post(
          "http://localhost:5000/api/payment/create-order",
          {
            amount: totalAmount * 100, 
            address: selectedAddress,
            paymentMethod,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const { orderId, amount, currency } = paymentResponse.data;
        console.log("Payment Response:", paymentResponse.data);
  
        const options = {
          key: "rzp_test_BJrRy7UBke7KlL",
          amount,
          currency,
          order_id: orderId,
          handler: async (response) => {
            console.log("Payment Success:", response);
            await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
  
           
            await axios.put(
              `http://localhost:5000/api/order/orders/${response.razorpay_order_id}`,
              { paymentStatus: "completed" },
              { headers: { Authorization: `Bearer ${token}` } }
            );
  
            navigate("/order-success"); 
          },
          prefill: {
            name: "Your Name",
            email: "email@example.com",
            contact: "1234567890",
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Order placement failed.");
    }
  };
  

  useEffect(() => {
    fetchAddresses();
    fetchCartAndWishlistItems();
  }, []);

  return (
    <div className="userpayment-container">
      <h2>Payment</h2>
  
     
      <div className="userpayment-address-section">
        <h3>Select Address</h3>
        <ul>
          {addresses.map((address) => (
            <li key={address.id}>
              <input
                type="radio"
                name="address"
                value={address.id}
                onChange={() => setSelectedAddress(address)}
              />
              <span>{`${address.name},
              ${address.street}, ${address.city}, ${address.state},${address.pincode}`}</span>
              
            </li>
          ))}
        </ul>
        <button onClick={() => navigate("/profile")}>Add New Address</button>
      </div>
  
    
      <div className="userpayment-method-section">
        <h3>Select Payment Method</h3>
        <div>
          <input
            type="radio"
            name="payment-method"
            value="cash-on-delivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </div>
        <div>
          <input
            type="radio"
            name="payment-method"
            value="online-payment"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Online Payment
        </div>
      </div>
  
     
      <h3 className="userpayment-total">Total Amount: ₹{totalAmount}</h3>
  
     
      <button className="userpayment-placeorder-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
  
  };
  
  export default UserPayment;
  