import api from "./Axios"

async function signUp(user = {}) {
    let response = await api.post("/auth/signUp", user);
    return response;
}
async function LoginApi(user = {}) {
    let response = await api.post("/auth/Login", user);
    return response;
}
export {
    signUp,
    LoginApi
}