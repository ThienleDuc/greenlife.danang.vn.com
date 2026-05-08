import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Tùy chọn: Tự động logout nếu token hết hạn
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export default api;