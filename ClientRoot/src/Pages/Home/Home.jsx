import React, { useEffect } from "react";
import Header from "./header/header";
import Sidenav from "./sidenav/sidenav";
import ChatArea from "./ChatArea/chatArea";
import { useSelector } from "react-redux";
import "./home.css";
import { getSocket } from "../../sockets/socket";

export default function home() {
  let socket = getSocket();
  let { user, selectedChat } = useSelector((state) => state.user) || {};
  useEffect(() => {
    if (!user) return;
    socket.emit("join-room", user?._id)
  }, [user]);
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <Sidenav />
        {selectedChat && <ChatArea />}
      </div>
    </div>
  );
}
