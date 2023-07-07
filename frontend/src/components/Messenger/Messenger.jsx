import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import "./Messenger.css";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import Conversation from "components/Conversations/Conversations";
import Message from "components/Message/Message";
import ChatOnline from "components/ChatOnline/ChatOnline";
import { io } from "socket.io-client";
import { BASE_URL } from "helper.js";

const Messenger = () => {
  const loggedInUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io(`${BASE_URL}`);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", loggedInUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        users
          /*loggedInUser.friends.filter((f) => users.some((u) => u.userId === f))*/
        );
      });
  }, [loggedInUser]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/conversations/${loggedInUser._id}`,
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
          `${BASE_URL}/messages/${currentChat?._id}`,
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
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== loggedInUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: loggedInUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
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
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages([...messages, data]);
          setNewMessage("");
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              Your Chats
            </div>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
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
                      <Message
                        message={m}
                        own={m?.sender === loggedInUser._id}
                      />
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
                  <Button
                    disabled={!newMessage}
                    onClick={handleSubmit}
                    //   sx={{
                    //     // color: palette.background.alt,
                    //     color: "black",
                    //     backgroundColor: palette.primary.main,
                    //     borderRadius: "3rem",
                    //   }}
                    sx={{
                      backgroundColor: "silver",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      padding: "5px 10px",
                      textTransform: "uppercase",
                      marginRight: "16px",
                      borderRadius: "0.75rem",
                      ":hover": {
                        backgroundColor: "#c147e9",
                      },
                    }}
                  >
                    SEND
                  </Button>
                </div>
              </>
            ) : (
              <span
                className="noConversationText"
                style={{ color: "silver", fontWeight: "bold" }}
              >
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline currentId={loggedInUser._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
