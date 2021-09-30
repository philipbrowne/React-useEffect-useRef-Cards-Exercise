import React from 'react';
import './Card.css';

const Card = ({ image, rotateDeg, transX, transY }) => {
  const style = {
    transform: `rotate(${rotateDeg}deg) translateY(${transY}px) translateX(${transX}px)`,
  };
  return (
    <div className="Card">
      <img src={image} alt="" style={style} />
    </div>
  );
};

export default Card;
