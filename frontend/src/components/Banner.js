import React from "react";
import "./Banner.css";
import { useNavigate } from "react-router-dom";
import ExploreTopBrands from "./ExploreTopBrands";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bannersingle-images">
        <div className="banner-image-container">
          <img
            src="https://images-static.nykaa.com/uploads/9df6c566-0e14-4662-aa3f-b7379251781b.jpg?tr=cm-pad_resize,w-1800"
            alt="Banner"
            className="banner-image"
          />
          
        </div>
        <br />
        
        <div>
      <ExploreTopBrands/>
     </div>
        


        <div className="savings">
        <br />
        <img
          src="https://images-static.nykaa.com/uploads/906df6a9-4d7a-43f6-99f5-be2e57d947e9.jpg?tr=cm-pad_resize,w-1800"
          alt="Banner"
          className="banner-image2"
        />

</div>

      </div>
     

     
      
      <div className="brands-section">
        <h2 className="brands-title">Big Brands, Big Savings</h2>
        <div className="brands-images">
        <a
            href="#"
            className="brand-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/brands/lakme"); 
            }}
          >
            <img
              src="https://images-static.nykaa.com/uploads/0623b3aa-830e-4de1-8220-378a95b4a2d6.png?tr=cm-pad_resize,w-450"
              alt="Brand 1"
              className="brand-image"
            />
          </a>
          <a
            href="#"
            className="brand-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/brands/kay"); 
            }}
          >
            <img
              src="https://images-static.nykaa.com/uploads/7c3f9fe8-d62c-468b-9329-620af05037b7.jpg?tr=cm-pad_resize,w-450"
              alt="Brand 2"
              className="brand-image"
            />
          </a>
          <a
            href="#"
            className="brand-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/brands/loreal"); 
            }}
          >
            <img
              src="https://images-static.nykaa.com/uploads/7dabe730-b626-4a91-b99e-466e91a7d906.jpg?tr=cm-pad_resize,w-450"
              alt="Brand 3"
              className="brand-image"
            />
          </a>
          <a
            href="#"
            className="brand-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/brands/mac"); 
            }}
          >
            <img
              src="https://images-static.nykaa.com/uploads/c00f46cc-c995-4fdd-8e07-7edcc32fbe58.png?tr=cm-pad_resize,w-450"
              alt="Brand 4"
              className="brand-image"
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default Banner;
