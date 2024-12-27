import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreTopBrands.css";

const ExploreTopBrands = () => {
  const navigate = useNavigate();
  const brands = [
    {
      image: "https://images-static.nykaa.com/creatives/d6fa5c7c-915d-423f-a605-5aa788e2011f/default.jpg?tr=cm-pad_resize,w-900",
      title: "Loreal",
      description: "Glow skin look for everyday",
      offer: "New Launch!",
      button: "Shop Now",
      route: "/brands/loreal", 
    },
    {
      image: "https://images-static.nykaa.com/creatives/5132ca2b-317b-4553-9f7a-70a4c9407478/default.png?tr=cm-pad_resize,w-900",
      title: "Nyka",
      description: "Ultimate Glow makeup Festive-Ready Skin",
      offer: "Upto 25% Off",
      button: "Shop Now",
      route: "/brands/nykaa", 
    },
    {
      image: "https://images-static.nykaa.com/creatives/60e4f360-3793-46fe-a6ff-59cddb835f4c/default.jpg?tr=cm-pad_resize,w-900",
      title: "MAC",
      description: "Own Your Glow or Master Matte",
      offer: "Mini on ₹2500",
      button: "Shop Now",
      route: "/brands/mac", 
    },
    {
      image: "https://images-static.nykaa.com/creatives/37049389-946f-463f-bee5-55460c969fbc/default.jpeg?tr=cm-pad_resize,w-900",
      title: "Lakme",
      description: "Everyday makeup for your Skin",
      offer: "Upto 35% Off",
      button: "Shop Now",
      route: "/brands/lakme", 
    },
  ];

  return (
    <section className="explore-top-brands">
      <h2>Explore Our Top Brands</h2>
      <p className="explore-subtitle">A-listers to obsess over</p>
      <div className="row">
        {brands.map((brand, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="explore-brand-card">
              <img src={brand.image} alt={brand.title} className="explore-brand-image" />
              <div className="explore-brand-info">
                <p className="explore-offer">{brand.offer}</p>
                <p className="explore-description">{brand.description}</p>
                <button
                  className="explore-shop-now"
                  onClick={() => navigate(brand.route)} 
                >
                  {brand.button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreTopBrands;
