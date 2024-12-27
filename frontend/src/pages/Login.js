import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', credentials);
      const { token, role } = res.data; 
      localStorage.setItem('token', token); 
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };
  

  return (
    <div className="login-page container-fluid d-flex justify-content-center align-items-center">
      <div className="login-box card p-4 shadow">
        <h2 className="text-center">Login</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <a href="/" className="text-primary">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
