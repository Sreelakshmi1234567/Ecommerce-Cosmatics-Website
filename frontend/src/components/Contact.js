import React from "react";
import "./Contact.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
  return (
    <section className="contact-section">
      <Navbar />
      <h2 className="contact-title">Get in touch</h2>
      <p className="contact-email">
        E-mail us:{" "}
        <a href="mailto:support.intl@nykaafashion.com">
          support.intl@nykaafashion.com
        </a>
      </p>
      <div className="contact-cards">
        <div className="contact-card">
          <h3>Chat</h3>
          <p>Monday to Saturday - 10:00 am to 19:00 pm</p>
          <a href="#" className="contact-link">
            1800-267-4444
          </a>
        </div>

        <div className="contact-card">
          <h3>Email</h3>
          <p>We strive to answer emails within 48 Hours</p>
          <a href="#" className="contact-link">
            support.intl@nykaafashion.com
          </a>
        </div>
      </div>
      <div className="contactfooter">
        <Footer />
      </div>
    </section>
  );
};

export default Contact;
