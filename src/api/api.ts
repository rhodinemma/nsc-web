import axios from "axios";

// Main backend axios instance
const instance = axios.create({
    baseURL: process.env.BASE_URL,
});

// Define response interceptor function
const responseInterceptor = (response: any) => response;

const errorInterceptor = async (error: any) => {
    let e = error;
    // this checks for when a token is not verified and logs you out
    if (error.response.status === 401 || error.response.status === 403) {
        window.location.href = "/";
    } else if (error.response.status === 502) {
        e = "Your request took too long, possibly a Server Error.";
        window.location.href = "/";
    }
    return Promise.reject(e);
};

// Response interceptors to instance
instance.interceptors.response.use(responseInterceptor, errorInterceptor);

export default instance;
