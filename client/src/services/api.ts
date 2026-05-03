import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export default api;