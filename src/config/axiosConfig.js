import axios from "axios";
import refreshAccessToken from "../component/Service/refreshToken";

const axiosInstance = axios.create({
  baseURL: "https://https://xetai-be.vercel.app/",
  timeout: 50000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        window.location.href = "/signIn";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
