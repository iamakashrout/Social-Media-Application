import React, { useEffect, useRef, useState } from "react";

import "./Messenger.css";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import Conversation from "components/Conversations/Conversations";
import Message from "components/Message/Message";
import ChatOnline from "components/ChatOnline/ChatOnline";

const Messenger = () => {
  const loggedInUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/conversations/${loggedInUser._id}`,
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
  }, [loggedInUser._id]);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/messages/${currentChat?._id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat])

  const handleSubmit = async (e) => {
    e.preventDefault();
   /*const message = {
      sender: loggedInUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };*/

    try {
      const res = await fetch(`http://localhost:5000/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: loggedInUser._id,
          text: newMessage,
          conversationId: currentChat._id,
        }),
      }).then((res) => res.json()).then((data) => {
        setMessages([...messages, data]);
        setNewMessage("");
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={()=>setCurrentChat(c)}>
                <Conversation conversation={c} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m?.sender===loggedInUser._id } />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
