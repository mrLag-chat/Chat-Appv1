import React, { use, useState } from "react";
import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice"
import { useNavigate } from "react-router-dom";

function Header() {
  let navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  ;
  let { user } = useSelector((state) => state.user);
  // Get user initials from name
  const getUserInitials = (name) => {
    let { firstname = "", lastname = "" } = user || {};
    let f = firstname.charAt(0).toUpperCase()
    let l = lastname.charAt(0).toUpperCase()
    return f + l
  };
  const getFulName = () => {
    ;
    if (!user) return;
    let { firstname = "", lastname = "" } = user || {};
    return `${firstname} ${lastname}`;
  };

  function onProfileClick() {
    navigate("/profile");

  }
  const userName = getFulName();
  const userInitials = getUserInitials(userName);

  return (
    <div className="chat-header">
      <div className="quick-chat">
        <div className="header-chat-icon">
          <i className="fa-solid fa-comment"></i>
        </div>
        <div>
          <p>Quick Chat</p>
        </div>
      </div>

      <div className="profile">
        <div className="profile-Name">
          <p>{userName}</p>
        </div>


        <div onClick={onProfileClick}>
          {!user?.profilePic && <span span
            className="profile-pic"
            title={`${userName} - ${isOnline ? "Online" : "Offline"}`}>
            {userInitials}</span>}

          {user?.profilePic && <span className="profile-pic profile-pic-image">
            <img src={user?.profilePic} /></span>}

          <div
            className={`status-indicator ${isOnline ? "online" : "offline"}`}></div>
        </div>


      </div>
    </div >
  );
}

export default Header;
