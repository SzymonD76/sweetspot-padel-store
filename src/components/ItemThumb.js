import React from 'react';

// Small product thumbnail used in the cart drawer and the checkout summary
const ItemThumb = ({ src, alt }) => (
  <div className="item-thumb">
    {src ? <img src={src} alt={alt} /> : <span>No image</span>}
  </div>
);

export default ItemThumb;
