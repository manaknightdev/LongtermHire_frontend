import api from "./api";

export const clientProfileApi = {
  // Get client profile
  getProfile: async () => {
    try {
      const response = await api.get("/v1/api/longtermhire/client/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update client profile (name only, email is read-only)
  updateProfile: async (profileData) => {
    try {
      console.log("Updating client profile with data:", profileData);
      const response = await api.put(
        "/v1/api/longtermhire/client/profile",
        profileData
      );
      console.log("Client profile update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Client profile update error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Change client password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put(
        "/v1/api/longtermhire/client/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
