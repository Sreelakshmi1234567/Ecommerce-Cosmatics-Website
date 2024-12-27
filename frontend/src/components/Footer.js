import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-light text-dark pt-4 allfooter">
      
      <div className="container text-center pb-3">
        <div className="row">
          <div className="col-md-3 col-6 mb-3">
            <i className="fas fa-truck fa-2x text-primary mb-2"></i>
            <p>Free Shipping<br />Above ₹299</p>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <i className="fas fa-sync-alt fa-2x text-primary mb-2"></i>
            <p>Easy Returns<br />In 15 Days</p>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <i className="fas fa-shield-alt fa-2x text-primary mb-2"></i>
            <p>Authentic Products<br />100%</p>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <i className="fas fa-tags fa-2x text-primary mb-2"></i>
            <p>2400+ Brands<br />1.9L Products</p>
          </div>
        </div>
      </div>

      
      <div className="inputemail text-white py-4">
        <div className="container">
          <div className="row align-items-center">
           
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-3">Get special discount on your inbox</p>
              <form className="d-flex justify-content-center justify-content-md-start">
                <input
                  type="email"
                  className="form-control me-2"
                  placeholder="Your Email"
                />
                <button className="btn btn-dark">SEND</button>
              </form>
            </div>

           
            <div className="col-md-6 text-center text-md-start help-info">
              <p className="mb-1">For any help, you may call us at</p>
              <p className="fw-bold mb-1">1800-267-4444</p>
              <p>(Monday to Saturday, 8AM to 10PM and Sunday, 10AM to 7PM)</p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-light py-3">
        <div className="container text-center">
          <div className="mb-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mx-2"
            >
              <i className="fab fa-facebook-f fa-2x"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-info mx-2"
            >
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-danger mx-2"
            >
              <i className="fab fa-instagram fa-2x"></i>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mx-2"
            >
              <i className="fab fa-linkedin-in fa-2x"></i>
            </a>
          </div>
          <p className="text-muted">© 2024 nykaa. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
