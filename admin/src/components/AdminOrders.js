import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState({}); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/order/adminorder', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      alert('Failed to fetch orders. Please try again.');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setLoadingOrders({ ...loadingOrders, [orderId]: true });
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/order/adminorders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => (order._id === orderId ? { ...order, status } : order)));
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoadingOrders({ ...loadingOrders, [orderId]: false });
    }
  };

  if (loading) {
    return <div className="adminorders-loading">Loading...</div>;
  }

  return (
    <div className="adminorders-container">
      <h1 className="adminorders-title">Admin Orders</h1>
      <div className="adminorders-table-wrapper">
        <table className="adminorders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId?.username}</td>
                <td>
                  {order.userAddress ? (
                    <div>
                      <p>{order.userAddress.street}</p>
                      <p>{order.userAddress.city}, {order.userAddress.state}</p>
                      <p>{order.userAddress.pincode}</p>
                    </div>
                  ) : (
                    <p>No address provided</p>
                  )}
                </td>
                <td>
                  <ul className="adminorders-item-list">
                    {order.items.map(item => (
                      <li key={item.productId}>
                        {item.name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  <button
                    className="adminorders-action-button"
                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                    disabled={loadingOrders[order._id] || order.status === 'Delivered'}
                  >
                    {loadingOrders[order._id]
                      ? 'Updating...'
                      : order.status === 'Delivered'
                      ? 'Delivered'
                      : 'Mark as Delivered'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
