import React from 'react'
import "./ChatOnline.css";

const ChatOnline = () => {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className='chatOnlineImg'
            src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
              </div>
              <div className='chatOnlineName'>
                  John Doe
              </div>
      </div>
    </div>
  );
}

export default ChatOnline