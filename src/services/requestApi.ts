import api from "./api";

export const requestApi = {
  // Admin: Get all requests
  getRequests: async () => {
    try {
      const response = await api.get(
        "/v1/api/longtermhire/super_admin/requests"
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Update request status
  updateRequestStatus: async (requestId, status, notes) => {
    try {
      const response = await api.put(
        `/v1/api/longtermhire/super_admin/requests/${requestId}/status`,
        {
          status,
          notes,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Client: Submit equipment request
  submitRequest: async (equipmentId, notes) => {
    try {
      const response = await api.post("/v1/api/longtermhire/member/requests", {
        equipment_id: equipmentId,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Client: Get own requests
  getClientRequests: async () => {
    try {
      const response = await api.get("/v1/api/longtermhire/member/requests");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Client: Get available equipment
  getAvailableEquipment: async () => {
    try {
      const response = await api.get("/v1/api/longtermhire/member/equipment");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
