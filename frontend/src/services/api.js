import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://taskplanet-social-feed.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (username, email, password) =>
    api.post("/auth/signup", { username, email, password }),
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
  getCurrentUser: () =>
    api.get("/auth/me"),
  updateProfilePicture: (profilePicture) =>
    api.put("/auth/profile-picture", { profilePicture }),
};

// Posts endpoints
export const postsAPI = {
  createPost: (content, image, category) =>
    api.post("/posts", { content, image, category }),
  getAllPosts: (category, sortBy) =>
    api.get("/posts", { params: { category, sortBy } }),
  getPost: (postId) =>
    api.get(`/posts/${postId}`),
  deletePost: (postId) =>
    api.delete(`/posts/${postId}`),
  likePost: (postId) =>
    api.post(`/posts/${postId}/like`),
  addComment: (postId, text) =>
    api.post(`/posts/${postId}/comment`, { text }),
  deleteComment: (postId, commentId) =>
    api.delete(`/posts/${postId}/comment/${commentId}`),
};

export default api;
