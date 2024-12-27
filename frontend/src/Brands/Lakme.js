import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import './Lakme.css';

function Lakme() {
  const [products, setProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState(''); 
  const [wishlist, setWishlist] = useState([]); 

  useEffect(() => {
    
    fetch('http://localhost:5000/api/lakme/lakmeproduct')
      .then((res) => res.json())
      .then((data) => setProducts(data));
      
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(savedWishlist);
  
  
    }, []);

  
  const handleAddToCart = async (userId, brand, productId, quantity, imagePath,price) => {
    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ userId, brand, productId, quantity, imagePath,price }), 
      });

      if (response.ok) {
        setAlertMessage('Product added to cart successfully!'); 
        setTimeout(() => {
          setAlertMessage(''); 
        }, 3000);
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

 
  const handleAddToWishlist = async (productId, name, imagePath, price,brand) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      setAlertMessage('Please log in to add products to the wishlist.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ productId, name, imagePath, price,brand }),
      });

      if (response.ok) {
        setWishlist((prevWishlist) =>{
          const updatedWishlist = [...prevWishlist, productId];localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          return updatedWishlist;

      });
        setAlertMessage('Product added to wishlist successfully!');
        setTimeout(() => setAlertMessage(''), 1000);
      } else {
        const errorData = await response.json();
        setAlertMessage(
          errorData.message || 'Failed to add product to wishlist'
        );
        console.error('Failed to add product to wishlist:', errorData.message);
      }
    } catch (error) {
      setAlertMessage('An error occurred while adding to wishlist.');
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <>
      <div>
        <div className='lakme-navbar'>
          <Navbar />
        </div>

       
        {alertMessage && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              borderRadius: '5px',
              fontSize: '1.2em',
              zIndex: 1000,
            }}
          >
            {alertMessage}
          </div>
        )}

        <div className="lakme-slider-container">
          <div className="lakme-slider">
            <img
              src="https://media6.ppl-media.com/tr:dpr-2,dpr-2/mediafiles/ecomm/misc/1681920826_lakme_default-banner-_web_1298x418.jpg"
              alt="Lakme Image 1"
              className="lakme-slide-image"
            />
            <img
              src="https://media6.ppl-media.com/tr:dpr-2,dpr-2/mediafiles/ecomm/misc/1733310859_lakme_vitcglow_skin_2596x836.jpeg"
              alt="Lakme Image 2"
              className="lakme-slide-image"
            />
          </div>
        </div>

        <div>
          <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Lakme Products</h1>
          <div class="product-card-container">
            {products.map((product) => {
              
              const discountedPrice = product.mrp - (product.mrp * product.discount) / 100;

              return (
                <div
                  key={product._id}
                  className="lakme-product-card"
                >
                  <img
                    src={`http://localhost:5000/${product.imagePath}`}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <h3>{product.name}</h3>
                  <p  className="price-original">
                    MRP ₹{product.mrp}
                  </p>
                  <p className="price-discounted">
                    ₹{discountedPrice.toFixed(2)}
                  </p>
                  <p className="price-off">{product.discount}% Off</p>
                  <div className="button-container">
                  <button
                    onClick={() => handleAddToCart('userId', 'lakmeProduct', product._id, 1, product.imagePath,product.price)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button
                      onClick={() =>
                        handleAddToWishlist(
                          product._id,
                          product.name,
                          product.imagePath,
                          product.price,
                          'lakmeProduct'

                        )
                      }
                      className="wishlist-btn"
                    >
                      <i
                        className={`fa-solid fa-heart ${
                          wishlist.includes(product._id) ? 'heart-active' : ''
                        }`}
                        style={{
                          fontSize: '24px',
                          color: wishlist.includes(product._id) ? 'magenta' : 'gray',
                        }}
                      ></i>
                    </button>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lakme;
