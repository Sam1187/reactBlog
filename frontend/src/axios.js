import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:7530",
});

instance.interceptors.request.use(
  (config) => {
    // config.headers.Authorization = window.localStorage.getItem("token");

    //     return config;
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;