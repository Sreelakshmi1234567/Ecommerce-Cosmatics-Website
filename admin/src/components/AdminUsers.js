import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="adminusers-loading">Loading...</div>;
  }

  return (
    <div className="adminusers-page-container">
      <h1>Registered Users</h1>
      <table className="adminusers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td data-label="Name">{user.username}</td>
              <td data-label="Email">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
