// @ts-nocheck
import api from "./api";

export const clientApi = {
  // Get all clients with pagination and search
  getClients: async (page = 1, limit = 10, searchData = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchData.clientId && { clientId: searchData.clientId }),
        ...(searchData.clientName && { clientName: searchData.clientName }),
        ...(searchData.companyName && { companyName: searchData.companyName }),
      });

      const response = await api.get(
        `/v1/api/longtermhire/super_admin/clients?${params}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Invite new client
  inviteClient: async (clientData) => {
    try {
      const response = await api.post(
        "/v1/api/longtermhire/super_admin/invite-client",
        clientData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      const response = await api.put(
        `/v1/api/longtermhire/super_admin/clients/${clientId}`,
        clientData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(
        `/v1/api/longtermhire/super_admin/clients/${clientId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get client equipment assignments
  getClientEquipment: async (clientUserId) => {
    try {
      const response = await api.get(
        `/v1/api/longtermhire/super_admin/client-equipment/${clientUserId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get client pricing assignment
  getClientPricing: async (clientUserId) => {
    try {
      const response = await api.get(
        `/v1/api/longtermhire/super_admin/client-pricing/${clientUserId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assign equipment to client
  assignEquipment: async (clientUserId, equipmentIds) => {
    try {
      const response = await api.post(
        "/v1/api/longtermhire/super_admin/assign-equipment",
        {
          client_user_id: clientUserId,
          equipment_ids: equipmentIds,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assign pricing to client
  assignPricing: async (
    clientUserId,
    pricingPackageId,
    customDiscount = null
  ) => {
    try {
      const requestData = {
        client_user_id: clientUserId,
        pricing_package_id: pricingPackageId,
      };

      // Add custom discount data if provided
      if (customDiscount) {
        requestData.custom_discount = customDiscount;
      }

      const response = await api.post(
        "/v1/api/longtermhire/super_admin/assign-pricing",
        requestData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
