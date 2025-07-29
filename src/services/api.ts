// @ts-nocheck
import axios from "axios";
import { toast } from "react-toastify";

// Base API configuration
const API_BASE_URL = "https://baas.mytechpassport.com"; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests with context-aware authentication
api.interceptors.request.use(
  (config) => {
    // Determine the context based on the URL
    const isClientRequest =
      config.url?.includes("/client/") ||
      config.url?.includes("/longtermhire/client/");
    const isAdminRequest =
      config.url?.includes("/admin/") || config.url?.includes("/super_admin/");

    if (isClientRequest) {
      // For client requests, only use client token
      const clientToken = localStorage.getItem("clientAuthToken");
      if (clientToken) {
        config.headers.Authorization = `Bearer ${clientToken}`;
      }
    } else if (isAdminRequest) {
      // For admin requests, only use admin token
      const adminToken = localStorage.getItem("authToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // For ambiguous requests, prioritize admin token but fallback to client
      const adminToken = localStorage.getItem("authToken");
      const clientToken = localStorage.getItem("clientAuthToken");

      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else if (clientToken) {
        config.headers.Authorization = `Bearer ${clientToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if it's not a login attempt
      const isLoginRequest = error.config?.url?.includes("/login");
      if (!isLoginRequest) {
        // Determine if this is a client or admin request
        const isClientRequest =
          error.config?.url?.includes("/client/") ||
          error.config?.url?.includes("/longtermhire/client/");

        if (isClientRequest) {
          // Client session expired
          toast.error("Your client session has expired. Please login again.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Clear client tokens and redirect to client login
          localStorage.removeItem("clientAuthToken");
          localStorage.removeItem("clientRole");
          localStorage.removeItem("clientUserId");
          localStorage.removeItem("clientEmail");
          localStorage.removeItem("clientProfile");

          setTimeout(() => {
            window.location.href = "/client/login";
          }, 1500); // Delay to show toast
        } else {
          // Admin session expired
          toast.error("Your admin session has expired. Please login again.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Clear admin tokens and redirect to admin login
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");
          localStorage.removeItem("user");

          setTimeout(() => {
            window.location.href = "/login";
          }, 1500); // Delay to show toast
        }
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      toast.error("You don't have permission to access this resource.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    return Promise.reject(error);
  }
);

// Utility function to clear all authentication state
export const clearAllAuthState = () => {
  // Clear admin tokens
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  // Clear client tokens
  localStorage.removeItem("clientAuthToken");
  localStorage.removeItem("clientRole");
  localStorage.removeItem("clientUserId");
  localStorage.removeItem("clientEmail");
  localStorage.removeItem("clientProfile");

  // Clear any other potential auth-related items
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  console.log("All authentication state cleared");
};

// Utility function to check current authentication context
export const getAuthContext = () => {
  const adminToken = localStorage.getItem("authToken");
  const clientToken = localStorage.getItem("clientAuthToken");

  if (adminToken && clientToken) {
    console.warn(
      "Warning: Both admin and client tokens found. This may cause conflicts."
    );
    return "conflict";
  } else if (adminToken) {
    return "admin";
  } else if (clientToken) {
    return "client";
  } else {
    return "none";
  }
};

export default api;
