import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "../services/chatApi";

export const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Polling interval for real-time updates
  const pollingInterval = useRef(null);
  const lastMessageTimestamp = useRef(0);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatApi.getConversations();
      if (!response.error) {
        setConversations(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load conversations");
      console.error("Load conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId, page = 1) => {
    try {
      setLoading(true);
      const response = await chatApi.getMessages(conversationId, page);
      if (!response.error) {
        const messagesData = response.data || [];

        if (page === 1) {
          // First page - replace all messages (already in correct order from backend)
          setMessages(messagesData);
        } else {
          // Additional pages - prepend older messages
          setMessages((prev) => [...messagesData, ...prev]);
        }

        // Update last message timestamp for real-time polling
        if (messagesData.length > 0) {
          const latestMessage = messagesData[messagesData.length - 1];
          lastMessageTimestamp.current = new Date(
            latestMessage.created_at
          ).getTime();
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load messages");
      console.error("Load messages error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (messageData) => {
      try {
        const response = await chatApi.sendMessage(messageData);
        if (!response.error) {
          // Add message to local state immediately for better UX
          const newMessage = {
            id: response.data.id,
            from_user_id: messageData.from_user_id || "current_user",
            to_user_id: messageData.to_user_id,
            message: messageData.message,
            message_type: messageData.message_type || "text",
            created_at: new Date().toISOString(),
            from_user_name: "You",
          };

          setMessages((prev) => [...prev, newMessage]);

          // Refresh conversations to update last message
          loadConversations();

          return response;
        } else {
          setError(response.message);
          return response;
        }
      } catch (err) {
        setError("Failed to send message");
        console.error("Send message error:", err);
        return { error: true, message: "Failed to send message" };
      }
    },
    [loadConversations]
  );

  // Send equipment request
  const sendEquipmentRequest = useCallback(
    async (requestData) => {
      try {
        const response = await chatApi.sendEquipmentRequest(requestData);
        if (!response.error) {
          // Add equipment request message to local state
          const requestMessage = {
            id: response.data.message_id,
            from_user_id: "current_user",
            to_user_id: requestData.to_user_id,
            message: requestData.message,
            message_type: "equipment_request",
            equipment_id: requestData.equipment_id,
            equipment_name: requestData.equipment_name,
            created_at: new Date().toISOString(),
            from_user_name: "You",
          };

          setMessages((prev) => [...prev, requestMessage]);

          // Refresh conversations
          loadConversations();

          return response;
        } else {
          setError(response.message);
          return response;
        }
      } catch (err) {
        setError("Failed to send equipment request");
        console.error("Send equipment request error:", err);
        return { error: true, message: "Failed to send equipment request" };
      }
    },
    [loadConversations]
  );

  // Poll for new messages (simulating real-time)
  const startPolling = useCallback(
    (conversationId) => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }

      pollingInterval.current = setInterval(async () => {
        try {
          const response = await chatApi.getMessages(conversationId, 1, 10);
          if (!response.error && response.data.length > 0) {
            const newMessages = response.data.filter(
              (msg) =>
                new Date(msg.created_at).getTime() >
                lastMessageTimestamp.current
            );

            if (newMessages.length > 0) {
              setMessages((prev) => [...prev, ...newMessages.reverse()]);
              lastMessageTimestamp.current = new Date(
                newMessages[newMessages.length - 1].created_at
              ).getTime();

              // Refresh conversations to update unread counts
              loadConversations();
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000); // Poll every 3 seconds

      setIsConnected(true);
    },
    [loadConversations]
  );

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setIsConnected(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    lastMessageTimestamp.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    // State
    conversations,
    messages,
    loading,
    error,
    isConnected,

    // Actions
    loadConversations,
    loadMessages,
    sendMessage,
    sendEquipmentRequest,
    startPolling,
    stopPolling,
    clearError,
    clearMessages,
  };
};
