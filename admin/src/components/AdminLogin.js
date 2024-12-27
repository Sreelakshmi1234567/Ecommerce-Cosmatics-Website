import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css'; 

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', credentials);
      const { token } = res.data;
      localStorage.setItem('token', token); 
      navigate('/admin'); 
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="adminlogin-page container-fluid">
      <div className="adminlogin-box">
        <h2>Admin Login</h2>
        {error && <p className="adminlogin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="adminlogin-input">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="adminlogin-input">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="adminlogin-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
