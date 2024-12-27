import React from 'react';
import './LastCard.css';

function LastCard() {
  return (
    <div className="last-card">
      <h2 className="last-card-title">Know Your Eyeshadow Brushes</h2>
      <div className="last-card-content">
        <img
          src="https://images-static.nykaa.com/uploads/bf046886-7407-4cfe-8966-44d5dd4751e7.jpg?tr=cm-pad_resize,w-1800" // Replace with the actual link or local path
          alt="Eyeshadow Brushes"
          className="last-card-image"
        />
      </div>
    </div>
  );
}

export default LastCard;
