import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import UserPage from './pages/UserPage';
import CartPage from './pages/CartPage';
import Profile from './components/Profile';
import WishlistPage from './pages/WishlistPage'
import OrderSuccess from './pages/OrderSuccess';



import Nyka from './Brands/Nyka';
import Maybelline from './Brands/Maybeline';
import Mac from './Brands/Mac';
import Loreal from './Brands/Loreal';
import Lakme from './Brands/Lakme';
import Kay from './Brands/Kay';
import Huda from './Brands/Huda';
import Color from './Brands/Color';
import OrdersPage from './pages/OrdersPage';





import UserPayment from './pages/UserPayment';
import About from './components/About';
import Contact from './components/Contact';



const App = () => {
  return (
    
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
         
          

          {/* User Routes */}
          <Route path="/user" element={<UserPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path='/profile'element={<Profile/>}/>
          <Route path='/wishlist'element={<WishlistPage/>}/>
          <Route path='/order-success'element={<OrderSuccess/>}/>
          <Route path='/orders'element={<OrdersPage/>}/>
          
          <Route path='/user-payment'element={<UserPayment/>}/>

          {/* Brand Routes */}
          <Route path="/brands/nykaa" element={<Nyka />} />
          <Route path="/brands/maybelline" element={<Maybelline />} />
          <Route path="/brands/mac" element={<Mac />} />
          <Route path="/brands/loreal" element={<Loreal />} />
          <Route path="/brands/lakme" element={<Lakme />} />
          <Route path="/brands/kay" element={<Kay />} />
          <Route path="/brands/huda" element={<Huda />} />
          <Route path="/brands/colorbar" element={<Color />} />



          <Route path='/contact'element={<Contact/>}/>
          <Route path='/about' element={<About/>}/>
          
        </Routes>
      </Router>
   
  );
};

export default App;
