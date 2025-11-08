
import api from "./Axios"
import { toast } from 'react-hot-toast'

async function getLoggedinUser(user = {}) {
    let response = await api.get("/user/get-Loggedin-user")
    return response;
}
async function getAllUsers() {
    let response = await api.get("/user/get-all-users")
    return response;
}
async function uploadUserProfile(image) {

    let response = await api.post("/user/profile", image);
    return response;


}



export {
    getLoggedinUser,
    getAllUsers,
    uploadUserProfile
}