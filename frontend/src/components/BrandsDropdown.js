import React, { useState } from 'react';
import './BrandsDropdown.css';
import nyka from '../images/nyk.jpg';
import may from '../images/may.jpg';
import lor from '../images/lor.jpg';
import mac from '../images/mac.jpg';
import lak from '../images/lak.jpg';
import col from '../images/col.jpg';
import huda from '../images/huda.jpg';
import kay from '../images/kay.jpg';
import { useNavigate } from 'react-router-dom'; 

const BrandsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate(); 

  
  const brands = [
    { name: 'Nykaa', logo: nyka, link: '/brands/nykaa' },
    { name: 'Maybelline', logo: may, link: '/brands/maybelline' },
    { name: 'L\'Oreal', logo: lor, link: '/brands/loreal' },
    { name: 'MAC', logo: mac, link: '/brands/mac' },
    { name: 'Lakme', logo: lak, link: '/brands/lakme' },
    { name: 'Colorbar', logo: col, link: '/brands/colorbar' },
    { name: 'Huda Beauty', logo: huda, link: '/brands/huda' },
    { name: 'Kay', logo: kay, link: '/brands/kay' },
  ];

 
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

 
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(false);
    }
  };

  
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const handleBrandClick = (link) => {
    navigate(link);  
  };

  return (
    <li
      className="nav-item dropdown-brands"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        className="nav-link"
        href="#"
        id="navbarDropdown"
        role="button"
        aria-expanded={isOpen}
        onClick={handleClick} 
      >
        Brands
      </a>

      
      <ul className={`dropdown-menu-brands ${isOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
       
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search Brands"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />

       
        <div className="container-brands">
          <div className="row">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <div className="col-3-brands mb-3" key={brand.name}>
                  <div
                    className="brand-logo-brands"
                    onClick={() => handleBrandClick(brand.link)} 
                  >
                    <img src={brand.logo} alt={brand.name} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No brands found</p>
              </div>
            )}
          </div>
        </div>
      </ul>
    </li>
  );
};

export default BrandsDropdown;
