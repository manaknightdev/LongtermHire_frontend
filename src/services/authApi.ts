import api from "./api";

export const authApi = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post("/v1/api/longtermhire/admin/login", {
        email,
        password,
      });

      if (response.data && !response.data.error) {
        // Clear any existing client tokens before setting admin tokens
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientRole");
        localStorage.removeItem("clientUserId");
        localStorage.removeItem("clientEmail");
        localStorage.removeItem("clientProfile");

        // Store admin token
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("userRole", response.data.role || "super_admin");
        localStorage.setItem("userId", response.data.user_id);

        console.log(
          "Admin login successful: Client tokens cleared, admin tokens set"
        );
        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout with complete session cleanup
  logout: () => {
    // Clear admin tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    // Also clear any client tokens to prevent cross-contamination
    localStorage.removeItem("clientAuthToken");
    localStorage.removeItem("clientRole");
    localStorage.removeItem("clientUserId");
    localStorage.removeItem("clientEmail");
    localStorage.removeItem("clientProfile");

    // Clear any other potential auth-related items
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log("Admin logout: All authentication tokens cleared");
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Get current user info
  getCurrentUser: () => {
    return {
      token: localStorage.getItem("authToken"),
      role: localStorage.getItem("userRole"),
      userId: localStorage.getItem("userId"),
    };
  },
};
