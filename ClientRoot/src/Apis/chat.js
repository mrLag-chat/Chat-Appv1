
import api from "./Axios"

async function getAllChats() {

    let response = await api.get("chat/get-all-chat");
    return response;


}
async function startNewChat(chat) {
    let response = await api.post("chat/create-new-chat", chat)
    return response;
}
async function clearAllUnreadMessages(chat) {
    let response = await api.post("chat/clear-unread-messages", chat)
    return response;
}

export {
    getAllChats,
    startNewChat,
    clearAllUnreadMessages
}