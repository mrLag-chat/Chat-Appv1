import axios from "axios"
import { toast } from "react-hot-toast"

let api = axios.create({
    baseURL: 'https://chat-app-server-wek3.onrender.com',
    //timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {

    let token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(config)
    return config
})

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (err) => {
        debugger
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            let message = err.response.data.message || err.message;
            toast.error(message)
            setTimeout(() => {
                window.location.href = "/Login";
            })

        }
        let errMessage = err?.response?.data?.message || err.message
        toast.error(errMessage)
        return Promise.reject(err);
    }
);

export default api;