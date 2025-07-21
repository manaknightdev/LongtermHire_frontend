// @ts-nocheck
import api from "./api";

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get("/v1/api/longtermhire/dashboard/stats");
    return response.data;
  },

  // Clear activity logs
  clearLogs: async () => {
    const response = await api.delete("/v1/api/longtermhire/dashboard/logs");
    return response.data;
  },

  // Mark messages as read (to reduce unread count)
  markMessagesAsRead: async (messageIds) => {
    const response = await api.put(
      "/v1/api/longtermhire/dashboard/messages/read",
      {
        messageIds,
      }
    );
    return response.data;
  },
};
