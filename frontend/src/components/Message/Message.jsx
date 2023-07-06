import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Message.css";

const Message = ({ message, own }) => {
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);

  const sender = message?.sender;

  const getUser = async () => {
    const response = await fetch(`http://localhost:5000/users/${sender}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);


  return (
    <div className={own? "message own": "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={user?.picturePath}
          alt=""
        />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{message?.createdAt}</div>
    </div>
  );
}

export default Message