import "./chatArea.css";
import { setSelectedChat } from "../../../redux/userSlice";
import { setAllChats } from "../../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, use, useRef } from "react";
import { createNewMessage, getAllMessages } from "../../../Apis/message";
import { clearAllUnreadMessages } from "../../../Apis/chat";
import moment from "moment";
import { toast } from "react-hot-toast";
import { getSocket } from "../../../sockets/socket";
import store from "../../../redux/store";
import EmojiPicker from "emoji-picker-react";

function ChatArea() {
  let dispatch = useDispatch();
  let socket = getSocket();
  let [onlineUsers, setOnlineUsers] = useState([])
  let [showEmoji, setShowEmoji] = useState(false)
  let { selectedChat, user } = useSelector((state) => state.user) || {};
  let chatScrollRef = useRef(null)
  let currentchat =
    selectedChat &&
    selectedChat.members.find((member) => member._id !== user._id);
  let [userAllMessages, setAllUserMessage] = useState([]);
  let USERID = user?._id;
  async function sendMessage(image = null) {
    if (!newMessage && !image) return;
    let messageObj = {
      senderId: USERID,
      message: newMessage,
      chatId: selectedChat._id,
      image
    };
    let sentMessage = await createNewMessage(messageObj);
    let socketMsgObj = {
      ...messageObj,
      members: selectedChat.members.map((member) => member._id),
      read: false,
      createdAt: moment().format('YYYY-MM-DD hh:mm:ss A')
    }
    socket.emit("send-message", socketMsgObj)
    setNewMessage("")
    setShowEmoji(false);
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatDate(message) {
    const msgTime = moment(message.createdAt);
    const today = moment();
    const diffDays = today.diff(msgTime, "days");

    if (diffDays < 1) {
      return `Today, ${msgTime.format("hh:mm A")}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${msgTime.format("hh:mm A")}`;
    } else if (diffDays < 7) {
      return `${msgTime.format("dddd, hh:mm A")}`; // e.g., Tuesday, 07:45 PM
    } else {
      return msgTime.format("MMMM DD, YYYY"); // older than a week
    }
  }

  async function loadChatMessages() {
    let messages = await getAllMessages(selectedChat?._id);
    if (messages.success) {
      let { allMessages } = messages;
      setAllUserMessage(allMessages);
      console.log(messages);
    }
  }
  async function clearUnreadMessagesfn() {
    socket.emit("clear-unread-messages", { chatId: selectedChat._id, members: selectedChat.members.map((member) => member._id) });
    let chatId = selectedChat._id
    await clearAllUnreadMessages({ chatId });
  }

  function onReceiveData(data) {
    let { allChats, selectedChat } = store.getState().user;
    if (data.chatId == selectedChat._id)
      setAllUserMessage((prevMsgs => [...prevMsgs, data]))
    if (data.senderId !== USERID && data.chatId == selectedChat._id) {
      clearUnreadMessagesfn();
    }
    let latestChat = allChats.find(chat => chat._id == data.chatId);
    let filteredChats = allChats.filter(chat => latestChat._id != chat._id);
    dispatch(setAllChats([latestChat, ...filteredChats]))
  }
  useEffect(() => {
    loadChatMessages();
    if (selectedChat?.lastMessage?.senderId !== USERID) {
      clearUnreadMessagesfn();
    }

    socket.off('receive-message', onReceiveData)
    socket.on("receive-message", onReceiveData)
    socket.off("message-cleared").on("message-cleared", data => {  // clear unread messages

      let { allChats, selectedChat } = store.getState().user;
      if (selectedChat?._id == data.chatId) {
        allChats = allChats.map(chat => {
          if (chat._id == data.chatId) {
            return { ...chat, unreadMessagesCount: 0 }
          }
          return chat
        })
        dispatch(setAllChats(allChats))
        setAllUserMessage(prevMsgs => {
          return prevMsgs.map(msg => {
            return {
              ...msg, read: true
            }
          })
        })

      }

    })
    socket.off("user-is-typing").on("user-is-typing", data => {
      
      if (data.chatId == selectedChat._id) {
        setIsTyping(true)
        scrollToview();
        setTimeout(() => {
          setIsTyping(false)
        }, 3000);
      }
    })
    socket.on("online-users", (data) => {
      
      setOnlineUsers(data)
    })
    return () => {
      socket.off("receive-message", onReceiveData);
      socket.off("message-cleared");
      socket.off("user-is-typing");
    };
  }, [selectedChat]);



  function scrollToview() {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }
  useEffect(() => {
    scrollToview();

  }, [userAllMessages])

  let [newMessage, setNewMessage] = useState("");
  let [isTyping, setIsTyping] = useState(false);


  function showTypingIndicator() {
    let { selectedChat } = store.getState().user
    let members = selectedChat.members.filter((member) => member._id != USERID).map(u => u._id)

    socket.emit("typing-indicator", { chatId: selectedChat._id, members });
  }
  let onEmojiClick = (e) => {
    
    console.log(e);
    setNewMessage(preMsg => {
      return preMsg + e.emoji
    })

  }
  function sendImage(e) {
    let file = e.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      sendMessage(reader.result);
    }
  }

  return (
    selectedChat && (
      <div className="chat-area-container">
        {/* Chat header */}
        <div className="chat-area-header">
          <div className="chat-user-info">
            <div className="chat-user-avatar">
              {currentchat.profilePic ? (
                <img
                  src={currentchat.profilePic}
                  alt={`${currentchat.firstname} ${currentchat.lastname}`}
                />
              ) : (
                <div className="avatar-initials">
                  {currentchat.firstname.charAt(0).toUpperCase()}
                  {currentchat.lastname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`${onlineUsers.includes(user._id) ? "online-indicator" : "offline-indicator"}`}></div>
            </div>
            <div className="chat-user-details">
              <div className="chat-user-name">
                {currentchat.firstname} {currentchat.lastname}

              </div>
              <div className="chat-user-status">Online</div>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="action-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="chat-messages-area" id="chat-messages-area" ref={chatScrollRef}>
          <div className="messages-container">
            {userAllMessages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.senderId == USERID
                  ? "message-sent"
                  : "message-received"
                  }`}
              >
                <div className="message-content">
                  {message?.message && <div className="message-text">{message.message}</div>}
                  {message?.image && <div className="chat-sent-image"><img src={message.image} alt="Image Not available"></img></div>}
                  <div div className="message-time">
                    {formatDate(message)}
                    {message.senderId === USERID && (
                      <span
                        className={`message-status ${message.read ? "read" : "sent"
                          }`}
                      >
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <div>Typing...</div>}
            <div className="emoji-container">
              {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} />}
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="message-input-container">

          <div className="input-wrapper">
            <button className="attach-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 6V17.5C16.5 19.71 14.71 21.5 12.5 21.5S8.5 19.71 8.5 17.5V5C8.5 3.62 9.62 2.5 11 2.5S13.5 3.62 13.5 5V15.5C13.5 16.05 13.05 16.5 12.5 16.5S11.5 16.05 11.5 15.5V6H10V15.5C10 16.88 11.12 18 12.5 18S15 16.88 15 15.5V5C15 2.79 13.21 1 11 1S7 2.79 7 5V17.5C7 20.54 9.46 23 12.5 23S18 20.54 18 17.5V6H16.5Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              className="message-input" id="message-input"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); showTypingIndicator() }} onKeyDown={handleKeyDown}
            />
            <div>
              <label htmlFor="imageUpload"><i className="fa-solid fa-image" style={{ color: "#007bff" }}></i>
                <input type="file" style={{ display: "none" }} id="imageUpload" accept="image/*" onChange={sendImage}></input>
              </label> </div>
            <div className="emoji-icon">
              <i class="fa-regular fa-face-smile" onClick={() => setShowEmoji(!showEmoji)} ></i>
            </div>
            <button className="send-button" onClick={sendMessage}  >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.01 21L23 12 2.01 3 2 10L17 12 2 14 2.01 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div >
    )
  );
}

export default ChatArea;
