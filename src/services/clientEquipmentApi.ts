import api from "./api";

export const clientEquipmentApi = {
  // Get client's assigned equipment
  getEquipment: async () => {
    try {
      const token = localStorage.getItem("clientAuthToken");
      const response = await api.get("/v1/api/longtermhire/client/equipment", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to get equipment");
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific equipment details
  getEquipmentDetails: async (equipmentId) => {
    try {
      const token = localStorage.getItem("clientAuthToken");
      const response = await api.get(`/v1/api/longtermhire/client/equipment/${equipmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to get equipment details");
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit equipment request
  submitRequest: async (equipmentId, message = "") => {
    try {
      const token = localStorage.getItem("clientAuthToken");
      const response = await api.post("/v1/api/longtermhire/client/equipment/request", {
        equipment_id: equipmentId,
        message: message
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
