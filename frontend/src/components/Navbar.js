import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../images/logo.jpg";
import BrandsDropdown from "./BrandsDropdown";

function Navbar() {
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState(null); 
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          return response.json();
        })
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
            setUserDetails(data); 
          } else {
            console.warn("No username found in response:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" height="40" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/user">
                Home
              </a>
            </li>
            <BrandsDropdown />
            
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center position-relative">
          

          
          <div
            className="nav-profile-menu me-3 position-relative"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <i className="fa-regular fa-user me-1"></i>
            {username || "Profile"}
            {dropdownVisible && (
              <div className="nav-dropdown-menu shadow-sm">
                <a href="/profile" className="nav-dropdown-item">
                  My Profile
                </a>
                <a href="/orders" className="nav-dropdown-item">
                  My Orders
                </a>
                <a href="/wishlist" className="nav-dropdown-item">
                  My Wishlist
                </a>
                <a
                  className="nav-dropdown-item nav-text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            )}
          </div>

          <a
            href="/cart"
            className="position-relative d-flex align-items-center"
          >
            <i className="fa-solid fa-bag-shopping"></i>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
