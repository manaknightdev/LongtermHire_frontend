import { useState, useEffect, useCallback } from "react";
import { chatApi } from "../services/chatApi";

export const useClientChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load conversations for the current client
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatApi.getConversations();
      
      if (!response.error) {
        setConversations(response.data || []);
        
        // If there's a conversation, load its messages
        if (response.data && response.data.length > 0) {
          const firstConversation = response.data[0];
          await loadMessages(firstConversation.id);
        }
      } else {
        setError(response.message || "Failed to load conversations");
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      const response = await chatApi.getMessages(conversationId);
      
      if (!response.error) {
        setMessages(response.data || []);
      } else {
        setError(response.message || "Failed to load messages");
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (toUserId, message) => {
    try {
      const response = await chatApi.sendMessage({
        to_user_id: toUserId,
        message: message,
        message_type: "text"
      });
      
      if (!response.error) {
        // Reload messages to show the new message
        if (conversations.length > 0) {
          await loadMessages(conversations[0].id);
        }
        return true;
      } else {
        setError(response.message || "Failed to send message");
        return false;
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
      return false;
    }
  }, [conversations, loadMessages]);

  // Clear error
  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    conversations,
    messages,
    loading,
    error,
    loadConversations,
    loadMessages,
    sendMessage,
    clearError,
  };
};
