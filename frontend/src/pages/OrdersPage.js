import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import Navbar from '../components/Navbar';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/order/orderget", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h1 className="text-center mt-5 mb-4 display-4">Your Orders</h1>
        <div className="container">
          {orders.map((order) => (
            <div className="orders-card mb-4 p-4 shadow-lg rounded" key={order._id}>
              <h2 className="text-primary">Order ID: {order._id}</h2>
              <h3 className="text-muted">Status: {order.deliveryStatus}</h3>
              {order.products.map((product) => (
                <div className="orders-product d-flex align-items-center mb-3" key={product.productId}>
                  <img
                    src={`http://localhost:5000/${product.productDetails.imagePath}`}
                    alt={product.productDetails.name}
                    className="img-fluid rounded mr-3"
                    style={{ width: '100px', height: 'auto' }}
                  />
                  <div className="orders-product-details flex-grow-1">
                    <p className="font-weight-bold">{product.productDetails.name}</p>
                    <p className="orders-price font-weight-bold text-pink">Price: ₹{product.productDetails.price}</p>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
