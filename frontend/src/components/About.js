import React from 'react';
import './About.css'; 
import Navbar from './Navbar';
import Footer from './Footer';

function About() {
  return (

    <div className="about-page">
        <Navbar/>
      <div className="about-container">
        <h1 className="main-heading">About Us</h1>
        <p className="about-description">
          Nykaa is an Indian e-commerce company focused on beauty and wellness products for women. Founded in 2012 by
          Falguni Nayar, Nykaa has become one of the leading online destinations for authentic beauty and wellness
          products in India. The name “Nykaa” comes from the Hindi word “Nayaka” meaning “heroine,” representing the
          empowered Indian woman.
        </p>

        <h2 className="sub-heading">Founding Story</h2>
        <p className="about-description">
          Falguni Nayar founded Nykaa at the age of 50 after a long and successful career as an investment banker.
          Despite having no prior experience in the beauty industry, Nayar saw a gap in the Indian market for an
          omni-channel retailer focused on curated content and advice in addition to a wide range of genuine beauty
          products.
        </p>
        <p className="about-description">
          The idea for Nykaa came to Nayar when she struggled to find quality beauty products for her daughter’s
          wedding trousseau. This made her recognize the difficulty Indian women faced in accessing real beauty advice
          and authentic products. She quit her job and invested $2 million of her own money to launch Nykaa.com in 2012
          with the aim of providing a one-stop destination for beauty enthusiasts.
        </p>

        <h2 className="sub-heading">Business Model</h2>
        <p className="about-description">
          Nykaa follows an inventory-led business model where they stock a wide range of products from over 3,500
          brands. This allows them to control authenticity while offering the convenience of fast delivery. Nykaa was
          also one of the first online retailers in India to launch their own private labels across several categories.
        </p>
        <p className="about-description">
          Unlike other e-commerce companies, Nykaa started with a mobile-first approach recognizing that Indian
          consumers were leapfrogging from desktops to mobile devices. Around 80% of Nykaa’s traffic today comes
          through mobile apps. Nykaa also invested heavily in content creation on YouTube, social media, and blogs to
          drive discovery and trust among consumers.
        </p>
      </div>
      <div className='aboutfooter'>
      <Footer/>
      </div>
    </div>
  );
}

export default About;
