import React from 'react';

function Homepage({ name, image }) {
  return (
    <div>
      <h1>Welcome {name}, Great to have you on board!</h1>
      <img src={image} alt="User" />
    </div>
  );
}

export default Homepage;

