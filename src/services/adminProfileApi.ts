import api from "./api";

export const adminProfileApi = {
  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get("/v1/api/longtermhire/admin/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update admin profile (name only, email is read-only)
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/v1/api/longtermhire/admin/profile", {
        data: profileData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change admin password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/v1/api/longtermhire/admin/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
