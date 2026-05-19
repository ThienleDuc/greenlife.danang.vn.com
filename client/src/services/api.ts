import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (!config) return config;

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
      const requestUrl = err.config?.url || "";
      const isAuthRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

      if (!isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export default api;