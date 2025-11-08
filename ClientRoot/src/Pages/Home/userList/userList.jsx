import "./userList.css";
import { useSelector, useDispatch } from "react-redux";
import store from "../../../redux/store";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import { startNewChat } from "../../../Apis/chat";
import moment from "moment";
import { useEffect, useState } from "react";
import { getSocket } from "../../../sockets/socket";
export default function userList({ searchKey }) {

  let socket = getSocket();

  let dispatch = useDispatch();
  let { allUsers, user, allChats, selectedChat } = useSelector((state) => state.user) || {};

  let [onlineUsers, setOnlineUsers] = useState([]);
  console.log(allUsers);
  async function startChatClick(startChatUserId) {
    let members = [startChatUserId, user._id];
    let newChat = await startNewChat({ members });
    dispatch(setAllChats([...allChats, newChat.data]));
  }
  const USERID = user?._id;
  function getLastMessage(userId) {
    let chat = allChats.find(chat => chat.members.map(u => u._id).includes(userId))
    if (!chat) return "";
    let lastMessagepreFix = chat?.lastmessage?.senderId == USERID ? "You: " : ""
    let lastsentMessage = chat?.lastmessage?.message
    if (!lastsentMessage) return ""
    return lastMessagepreFix + lastsentMessage
  }

  function getLastMessageTimeStamp(userId) {
    let chat = allChats.find(chat => chat.members.map(u => u._id).includes(userId))
    if (!chat) return "";
    let lastMessageCreatedAt = chat?.lastmessage?.createdAt
    let formatedDate = new moment(lastMessageCreatedAt).format("MM/DD/YY");
    return formatedDate;
  }

  function openChart(startChatUserId) {
    let chat = allChats.find((chat) => {
      return (
        chat.members.map((member) => member._id).includes(startChatUserId) &&
        chat.members.map((member) => member._id).includes(user._id)
      );
    });
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  }
  function getUnreadMessagesCount(userId) {
    let chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));
    if (!chat) return "";
    let unreadMessagecount = chat?.unreadMessagesCount > 0 ? chat.unreadMessagesCount : "";
    if (unreadMessagecount) return <div className="unread-msg-count">{unreadMessagecount}</div>;
    return "";

  }

  function getSortedusers() {
    if (searchKey == "") {
      return allChats;
    }
    return allUsers?.filter((user) => {
      return (user.firstname.includes(searchKey) ||
        user.lastname.includes(searchKey))
    })
  }



  useEffect(() => {
    socket.on("receive-message", (data) => {
      let userSelectedChat = store.getState().user.selectedChat;
      console.log(selectedChat)
      let userAllChats = store.getState().user.allChats;
      if (userSelectedChat?._id != data.chatId) {
        let newAllChats = userAllChats.map((chat) => {
          if (chat._id == data.chatId) {
            return {
              ...chat,
              lastmessage: data,
              unreadMessagesCount: (chat.unreadMessagesCount || 0) + 1
            }
          }
          return chat;
        })


        let latestChat = newAllChats.find(chat => chat._id == data.chatId);


        let filteredChats = newAllChats.filter(chat => {
          if (latestChat._id != chat._id) return chat
        })
        dispatch(setAllChats([latestChat, ...filteredChats]))
      }






    })
    socket.on("online-users", (data) => {
      
      setOnlineUsers(data)
    })
  }, [allChats])




  return (
    <div className="user-list-container">
      {
        getSortedusers().map((eachUser, index) => {
          let user = eachUser;
          if (user.members) {
            user = user.members.find(m => m._id != USERID)
          }
          return (
            <div
              key={user._id}
              className="user-card"
              onClick={() => openChart(user._id)}
            >
              <div className="user-info">
                <div className="user-avatar">
                  {user.profilePic ? (
                    <div className="avatar-image">
                      <img
                        src={user.profilePic}
                        alt={`${user.firstname} ${user.lastname}`}
                      />
                    </div>
                  ) : (
                    <div className="avatar-letters">
                      {user.firstname.charAt(0).toUpperCase() +
                        user.lastname.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`test-class ${onlineUsers.includes(user._id) ? "online-indicator" : "offline-indicator"}`}></div>
                </div>
                <div className="user-details">
                  <div className="user-name">
                    <div>
                      {user.firstname} {user.lastname}``
                    </div>
                    {getUnreadMessagesCount(user._id)}
                  </div>
                  <div className="user-email-div">
                    <div className="last-message">{getLastMessage(user?._id) || user.email}</div>
                    <div>{getLastMessageTimeStamp(user._id)}</div>
                  </div>
                </div>
              </div>
              <div className="user-actions">
                {!allChats.some((chat) =>
                  chat.members.map((member) => member._id).includes(user._id)
                ) && (
                    <button
                      className="chat-button"
                      onClick={() => startChatClick(user._id)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Start Chat
                    </button>
                  )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
