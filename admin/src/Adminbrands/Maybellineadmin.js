import React, { useState, useEffect } from 'react';
import './Mayadmin.css';

function Maybellineadmin() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    mrp: '',
    discount: '',
    image: null,
  });
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    fetch('http://localhost:5000/api/maybelline/maybellineproduct')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => formDataObj.append(key, formData[key]));

    const url = editId
      ? `http://localhost:5000/api/maybelline/maybellineproduct/${editId}`
      : 'http://localhost:5000/api/maybelline/maybellineproduct';
    const method = editId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: formDataObj,
    });
    const data = await response.json();

    setProducts((prev) =>
      editId ? prev.map((p) => (p._id === editId ? data : p)) : [...prev, data]
    );
    setEditId(null);
    setFormData({ name: '', mrp: '', discount: '', image: null });
  };

  
  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      mrp: product.mrp,
      discount: product.discount,
      image: null, 
    });
  };

  
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/maybelline/maybellineproduct/${id}`, {
      method: 'DELETE',
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="maybellineadmin-container">
      <h1 className="maybellineadmin-title"> Maybelline Admin Page</h1>
      <form onSubmit={handleSubmit} className="maybellineadmin-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="maybellineadmin-input"
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="maybellineadmin-input"
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={formData.discount}
          onChange={handleChange}
          className="maybellineadmin-input"
        />
        <input type="file" onChange={handleFileChange} className="maybellineadmin-input" />
        <button type="submit" className="maybellineadmin-button">
          {editId ? 'Update' : 'Add'} Product
        </button>
      </form>

      <ul className="maybellineadmin-product-list">
        {products.map((product) => {
          const discountedPrice =
            product.mrp - (product.mrp * product.discount) / 100;

          return (
            <li key={product._id} className="maybellineadmin-product-card">
              <img
                src={`http://localhost:5000/${product.imagePath}`}
                alt={product.name}
                className="maybellineadmin-product-image"
              />
              <h4 className="maybellineadmin-product-name">{product.name}</h4>
              <p className="maybellineadmin-product-mrp"> MRP₹{product.mrp}</p>
              <p className="maybellineadmin-product-discounted">
                ₹{discountedPrice.toFixed(2)}
              </p>
              <p className="maybellineadmin-product-discount">{product.discount}% Off</p>
              <button
                onClick={() => handleEdit(product)}
                className="maybellineadmin-edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="maybellineadmin-delete-button"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Maybellineadmin;


