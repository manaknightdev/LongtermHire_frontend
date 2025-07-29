import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "../services/chatApi";

export const useClientChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminStatus, setAdminStatus] = useState({
    has_online_admin: false,
    online_admin_count: 0,
    total_admin_count: 0,
  });

  // Intervals for online status management
  const heartbeatInterval = useRef(null);
  const adminStatusInterval = useRef(null);

  // Set user online status
  const setOnline = useCallback(async () => {
    try {
      await chatApi.setOnline();
    } catch (err) {
      console.error("Failed to set online status:", err);
    }
  }, []);

  // Set user offline status
  const setOffline = useCallback(async () => {
    try {
      await chatApi.setOffline();
    } catch (err) {
      console.error("Failed to set offline status:", err);
    }
  }, []);

  // Send heartbeat
  const sendHeartbeat = useCallback(async () => {
    try {
      await chatApi.sendHeartbeat();
    } catch (err) {
      console.error("Failed to send heartbeat:", err);
    }
  }, []);

  // Check admin status
  const checkAdminStatus = useCallback(async () => {
    try {
      const response = await chatApi.getAdminStatus();
      if (!response.error) {
        setAdminStatus(response.data);
        setAdminOnline(response.data.has_online_admin);
      }
    } catch (err) {
      console.error("Failed to check admin status:", err);
    }
  }, []);

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
  const sendMessage = useCallback(
    async (toUserId, message) => {
      try {
        const response = await chatApi.sendMessage({
          to_user_id: toUserId,
          message: message,
          message_type: "text",
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
    },
    [conversations, loadMessages]
  );

  // Start heartbeat interval
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }

    heartbeatInterval.current = setInterval(() => {
      sendHeartbeat();
    }, 30000); // Send heartbeat every 30 seconds
  }, [sendHeartbeat]);

  // Stop heartbeat interval
  const stopHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, []);

  // Start admin status checking
  const startAdminStatusCheck = useCallback(() => {
    if (adminStatusInterval.current) {
      clearInterval(adminStatusInterval.current);
    }

    adminStatusInterval.current = setInterval(() => {
      checkAdminStatus();
    }, 60000); // Check admin status every minute
  }, [checkAdminStatus]);

  // Stop admin status checking
  const stopAdminStatusCheck = useCallback(() => {
    if (adminStatusInterval.current) {
      clearInterval(adminStatusInterval.current);
      adminStatusInterval.current = null;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError("");
  }, []);

  // Initialize online status and intervals on mount
  useEffect(() => {
    // Set online status on mount
    setOnline();

    // Start heartbeat
    startHeartbeat();

    // Start admin status checking
    startAdminStatusCheck();

    // Check admin status immediately
    checkAdminStatus();

    // Handle beforeunload (tab close, browser close)
    const handleBeforeUnload = () => {
      setOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      setOffline();
      stopHeartbeat();
      stopAdminStatusCheck();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    setOnline,
    setOffline,
    startHeartbeat,
    stopHeartbeat,
    startAdminStatusCheck,
    stopAdminStatusCheck,
    checkAdminStatus,
  ]);

  return {
    conversations,
    messages,
    loading,
    error,
    adminOnline,
    adminStatus,
    loadConversations,
    loadMessages,
    sendMessage,
    clearError,
    setOnline,
    setOffline,
    sendHeartbeat,
    checkAdminStatus,
  };
};
