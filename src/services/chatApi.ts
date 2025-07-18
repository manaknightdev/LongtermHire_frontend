import api from "./api";

export const chatApi = {
  // Get chat conversations
  getConversations: async () => {
    const response = await api.get("/v1/api/longtermhire/chat/conversations");
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId, page = 1, limit = 30) => {
    const response = await api.get(
      `/v1/api/longtermhire/chat/messages/${conversationId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Send a message
  sendMessage: async (messageData) => {
    const response = await api.post(
      "/v1/api/longtermhire/chat/send",
      messageData
    );
    return response.data;
  },

  // Send equipment request
  sendEquipmentRequest: async (requestData) => {
    const response = await api.post(
      "/v1/api/longtermhire/chat/equipment-request",
      requestData
    );
    return response.data;
  },

  // Get equipment requests (for admin)
  getEquipmentRequests: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get(
      "/v1/api/longtermhire/chat/equipment-requests",
      { params }
    );
    return response.data;
  },

  // Update equipment request status
  updateRequestStatus: async (requestId, status, notes = null) => {
    const response = await api.put(
      `/v1/api/longtermhire/chat/equipment-requests/${requestId}`,
      {
        status,
        notes,
      }
    );
    return response.data;
  },

  // Get all clients (for admin to start conversations)
  getClients: async () => {
    const response = await api.get("/v1/api/longtermhire/chat/clients");
    return response.data;
  },

  // Start a new conversation (admin with client)
  startConversation: async (clientId, initialMessage = null) => {
    const response = await api.post(
      "/v1/api/longtermhire/chat/start-conversation",
      {
        client_id: clientId,
        initial_message: initialMessage,
      }
    );
    return response.data;
  },
};
