

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

import nykaaLogo from "../images/nyk.jpg";
import maybellineLogo from "../images/may.jpg";
import lorealLogo from "../images/lor.jpg";
import macLogo from "../images/mac.jpg";
import lakmeLogo from "../images/lak.jpg";
import colorbarLogo from "../images/col.jpg";
import hudaBeautyLogo from "../images/huda.jpg";
import kayBeautyLogo from "../images/kay.jpg";

function AdminPage() {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    navigate(`/admin/brands/${brand}`); 
  };

  const handleUsersClick = () => {
    navigate('/AdminUsers');
  };

  const handleAdminOrdersClick = () => {
    navigate('/AdminOrders');
  };

  return (
    <div className="adminpage-container">
      <header className="adminpage-header">
        <h1>Admin Dashboard</h1>
        <h4>Welcome to the Admin Dashboard</h4>
      </header>

      <div className="adminpage-sidebar">
        <ul>
          <li onClick={handleUsersClick}>Users</li>
          <li onClick={handleAdminOrdersClick}>Orders</li>
        </ul>
      </div>

      <main className="adminpage-content">
        <div className="adminpage-brand-grid">
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("nykaa")}>
            <img src={nykaaLogo} alt="Nykaa" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("maybelline")}>
            <img src={maybellineLogo} alt="Maybelline" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("loreal")}>
            <img src={lorealLogo} alt="L'Oréal" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("mac")}>
            <img src={macLogo} alt="MAC" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("lakme")}>
            <img src={lakmeLogo} alt="Lakmé" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("colorbar")}>
            <img src={colorbarLogo} alt="Colorbar" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("huda")}>
            <img src={hudaBeautyLogo} alt="Huda Beauty" />
          </div>
          <div className="adminpage-brand-item" onClick={() => handleBrandClick("kay")}>
            <img src={kayBeautyLogo} alt="Kay Beauty" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
