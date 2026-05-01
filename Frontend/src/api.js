import axios from "axios";

const API = axios.create({
  baseURL: "https://teamtaskmanager-production-3f97.up.railway.app"
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
