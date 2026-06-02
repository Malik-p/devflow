import axios from "axios";

const API = axios.create({
  baseURL:
    "http://54.90.194.227:5000/api",
});

// 🔥 ATTACH TOKEN
API.interceptors.request.use(
  (req) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  }
);

export default API;