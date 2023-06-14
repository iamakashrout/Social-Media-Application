import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from 'state';



function Homepage() {
  const dispatch = useDispatch();
   const { firstName, picturePath } = useSelector((state) => state.user);
  return (
    <>
      <div>
        <h1>Welcome {firstName}, Great to have you on board!</h1>
        <img
          src={`http://localhost:5000/assets/${picturePath}`}
          height={100}
          width={100}
          alt="User"
        />
        <div>
          <button onClick={() => dispatch(setLogout())}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Homepage;

