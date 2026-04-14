// src/api/authApi.js
import apiClient from "./apiClient";

export const authApi = {
  // Login: find user in json-server /users by email + password
  login: async (email, password) => {
    try {
      const res = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
      const users = res.data;
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) throw new Error("Invalid credentials");

      // Store user id as the "session token"
      localStorage.setItem("token", String(user.id));
      return user;
    } catch (error) {
      throw new Error(error.message || "Login failed. Please check your credentials.");
    }
  },

  // Register: create a new user in json-server /users
  register: async (username, email, password, role = "patient", name = undefined) => {
    try {
      // Check if user already exists
      const checkRes = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
      if (checkRes.data.length > 0) throw new Error("User already exists");

      const newUser = {
        username,
        email,
        password,
        name: name || username,
        role,
      };

      const res = await apiClient.post("/users", newUser);
      const user = res.data;

      // Store user id as the "session token"
      localStorage.setItem("token", String(user.id));
      return user;
    } catch (error) {
      throw new Error(error.message || "Registration failed. Please try again.");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  // Get current user from json-server using stored id
  getMe: async () => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    try {
      const res = await apiClient.get(`/users/${userId}`);
      return res.data;
    } catch {
      throw new Error("Failed to get user info");
    }
  },

  getCurrentUser: async () => {
    const userId = localStorage.getItem("token");
    if (!userId) return null;
    try {
      const res = await apiClient.get(`/users/${userId}`);
      return res.data;
    } catch {
      return null;
    }
  },
};

export default authApi;
