
import api from "./Axios"
async function createNewMessage(message = {}) {
    let response = await api.post("messages/new-message", message,);
    return response;
}

async function getAllMessages(chatId) {
    let response = await api.get(`/messages/get-all-messages/${chatId}`);
    return response;
}

export {
    createNewMessage,
    getAllMessages
}