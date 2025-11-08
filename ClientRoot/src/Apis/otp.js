import api from "./Axios"
function sendOtpApi(data = {}) {
    return api.post("/user/verify-otp", data)
}

export {
    sendOtpApi
}