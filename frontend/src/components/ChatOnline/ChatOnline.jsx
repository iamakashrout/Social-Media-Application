import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import "./ChatOnline.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "helper.js";

const ChatOnline = ({ currentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/conversations/${currentId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentId]);

  console.log(conversations);

  const getFriends = async () => {
    const response = await fetch(
      `${BASE_URL}/users/${currentId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []);

  const handleClick = async (user) => {
    try {
      const res = await fetch(`${BASE_URL}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: currentId,
          receiverId: user._id,
        }),
      })
        .then((res) => res.json)
        .then((data) => {
          navigate(`/messenger`);
          navigate(0);
        });
    } catch (err) {
      console.log(err);
    }
  };

  var contacts = [];
  for (let i = 0; i < conversations?.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (conversations[i].members[j] !== currentId) {
        contacts.push(conversations[i].members[j]);
      }
    }
  }
  console.log(contacts);
  console.log(friends);

  var temp = friends.filter((f) => !contacts?.includes(f._id));

  console.log(temp);

  return (
    <div className="chatOnline">
      <div style={{fontSize: "20px", fontWeight: "bold"}}>Select Friend to Start a Chat</div>
      {Array.isArray(temp) &&
        temp?.map((o) => (
          <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
            <div className="chatOnlineImgContainer">
              <img className="chatOnlineImg" src={o?.picturePath} alt="" />
            </div>
            <span className="chatOnlineName">
              {o?.firstName} {o?.lastName}
            </span>
            <divider/>
          </div>
        ))}
    </div>
  );
};

export default ChatOnline;
