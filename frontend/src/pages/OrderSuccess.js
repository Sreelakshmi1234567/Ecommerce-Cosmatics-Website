import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="ordersuccess-container">
      <div className="ordersuccess-card">
        <h2 className="ordersuccess-title">Order Placed Successfully!</h2>
        <p className="ordersuccess-message">Your payment was successful, and your order is now being processed.</p>
        <button 
          className="ordersuccess-button"
          onClick={() => navigate('/orders')}
        >
          Go to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
