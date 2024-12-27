import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setSuccess(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-page container-fluid d-flex justify-content-center align-items-center">
      <div className="register-box card p-4 shadow">
        <h2 className="text-center">Register</h2>
        {success && <p className="text-success">{success}</p>}
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login" className="text-primary">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
