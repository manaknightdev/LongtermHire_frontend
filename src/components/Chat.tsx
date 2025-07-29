// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useOnlineStatus } from "../contexts/OnlineStatusContext";
import { chatApi } from "../services/chatApi";
import { ClipLoader } from "react-spinners";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [clients, setClients] = useState([]);
  const [showNewConversationModal, setShowNewConversationModal] =
    useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  // Refs for scroll management
  const messagesEndRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Use the chat hook for real-time functionality
  const {
    conversations,
    messages,
    loading,
    loadConversations,
    loadMessages,
    sendMessage,
    startPolling,
    stopPolling,
    clearMessages,
  } = useChat();

  // Use global online status
  const { adminOnline, adminStatus } = useOnlineStatus();

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.other_user_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;

        if (force || isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      scrollToBottom(true); // Force scroll for new messages
      lastMessageCountRef.current = messages.length;
    }
  }, [messages]);

  // Auto-scroll when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => scrollToBottom(true), 100); // Small delay to ensure DOM is updated
    }
  }, [selectedConversation]);

  // Effect to handle auto-scroll when messages change
  useEffect(() => {
    const currentMessageCount = messages.length;
    const previousMessageCount = lastMessageCountRef.current;

    if (currentMessageCount > previousMessageCount) {
      // New message arrived, scroll to bottom
      setTimeout(() => scrollToBottom(true), 100);
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages]);

  // Effect to scroll to bottom when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => scrollToBottom(true), 200);
    }
  }, [selectedConversation]);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
    loadClients();
  }, [loadConversations]);

  // Load clients for new conversation
  const loadClients = async () => {
    try {
      const response = await chatApi.getClients();
      if (!response.error) {
        setClients(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    clearMessages();
    loadMessages(conversation.id);
    startPolling(conversation.id);
    // Close sidebar on mobile when conversation is selected
    setShowSidebar(false);
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const messageData = {
      to_user_id: selectedConversation.other_user_id,
      message: messageInput.trim(),
      message_type: "text",
    };

    const result = await sendMessage(messageData);
    if (!result.error) {
      setMessageInput("");
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Start conversation with selected client
  const handleStartConversation = async (client = null) => {
    try {
      let clientToUse = client;

      // If no client passed, use selectedClientId and find the client
      if (!client && selectedClientId) {
        clientToUse = clients.find(
          (c) => c.user_id === parseInt(selectedClientId)
        );
      }

      if (!clientToUse) {
        console.error("No client selected");
        return;
      }

      // Check if conversation already exists
      if (clientToUse.has_conversation === 1) {
        console.error("Conversation already exists with this client");
        return;
      }
      console.log(clientToUse, clients);

      const response = await chatApi.startConversation(
        clientToUse.user_id,
        `Hello ${clientToUse.name}, how can I help you today?`
      );

      if (!response.error) {
        // Reload conversations to show the new one
        loadConversations();
        setShowNewConversationModal(false);
        setSelectedClientId("");
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <div className="flex h-full bg-[#1F1F20] text-[#E5E5E5] relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Left Column - Conversations List */}
      <div
        className={`
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        fixed lg:relative
        top-0 left-0
        w-80 h-full
        bg-[#1F1F20] border-r border-[#333333]
        flex flex-col
        z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#333333]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[#E5E5E5] font-[Inter] font-bold text-xl sm:text-2xl leading-tight">
              Chat
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewConversationModal(true)}
                className="bg-[#FDCE06] text-[#1F1F20] px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-[#E5B800] transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {/* Close button for mobile */}
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden text-[#E5E5E5] p-2 hover:bg-[#292A2B] rounded-lg transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#292A2B] text-[#E5E5E5] placeholder-[#9CA3AF] pl-10 pr-4 py-3 rounded-lg border border-[#333333] focus:border-[#FDCE06] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-[#9CA3AF]">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-[#9CA3AF]">No conversations found</div>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-4 border-b border-[#333333] cursor-pointer overflow-hidden hover:bg-[#292A2B] transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? "bg-[#292A2B] border-l-4 border-l-[#FDCE06]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-[90%]">
                    <h3 className="text-[#E5E5E5] font-medium">
                      {conversation.other_user_name || "Unknown User"}
                    </h3>
                    <p className="text-[#9CA3AF] text-sm truncate mt-1">
                      {conversation.last_message_text || "No messages yet"}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <div className="bg-[#FDCE06] text-[#1F1F20] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column - Chat Messages and Input */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-[#1F1F20] border-b border-[#333333] p-4 flex items-center justify-between">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-[#E5E5E5] p-2 hover:bg-[#292A2B] rounded-lg transition-colors"
          >
            <svg
              width="18"
              height="15"
              viewBox="0 0 18 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2_1204)">
                <path
                  d="M5.9378 10.375C9.0796 10.375 11.6253 8.22031 11.6253 5.5625C11.6253 2.90469 9.0796 0.75 5.9378 0.75C2.796 0.75 0.250299 2.90469 0.250299 5.5625C0.250299 6.61797 0.652252 7.59414 1.33311 8.38984C1.23741 8.64687 1.09522 8.87383 0.94483 9.06523C0.81358 9.23477 0.679596 9.36602 0.581159 9.45625C0.53194 9.5 0.490924 9.53555 0.463581 9.55742C0.449909 9.56836 0.438971 9.57656 0.433502 9.5793L0.428034 9.58477C0.277643 9.69688 0.212018 9.89375 0.272174 10.0715C0.332331 10.2492 0.499127 10.375 0.687799 10.375C1.28389 10.375 1.88546 10.2219 2.38585 10.0332C2.63741 9.9375 2.87256 9.83086 3.07764 9.72148C3.9171 10.1371 4.89327 10.375 5.9378 10.375ZM12.5003 5.5625C12.5003 8.6332 9.79053 10.9465 6.58038 11.2227C7.24483 13.257 9.44874 14.75 12.0628 14.75C13.1073 14.75 14.0835 14.5121 14.9257 14.0965C15.1308 14.2059 15.3632 14.3125 15.6148 14.4082C16.1151 14.5969 16.7167 14.75 17.3128 14.75C17.5015 14.75 17.671 14.627 17.7284 14.4465C17.7858 14.266 17.723 14.0691 17.5698 13.957L17.5644 13.9516C17.5589 13.9461 17.548 13.9406 17.5343 13.9297C17.5069 13.9078 17.4659 13.875 17.4167 13.8285C17.3183 13.7383 17.1843 13.607 17.053 13.4375C16.9026 13.2461 16.7605 13.0164 16.6648 12.7621C17.3456 11.9691 17.7476 10.993 17.7476 9.93477C17.7476 7.39727 15.4261 5.31641 12.4812 5.13594C12.4921 5.27539 12.4976 5.41758 12.4976 5.55977L12.5003 5.5625Z"
                  fill="#FDCE06"
                />
              </g>
              <defs>
                <clipPath id="clip0_2_1204">
                  <path d="M0.25 0.75H17.75V14.75H0.25V0.75Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <h1 className="text-[#E5E5E5] font-[Inter] font-bold text-xl">
            {selectedConversation
              ? selectedConversation.other_user_name
              : "Chat"}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#1F1F20] border-b border-[#333333] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[#E5E5E5] font-semibold text-lg">
                    {selectedConversation.other_user_name || "Unknown User"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${adminOnline ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                    <span
                      className={`text-xs ${adminOnline ? "text-green-400" : "text-gray-400"}`}
                    >
                      {adminOnline
                        ? `Admin Online (${adminStatus.online_admin_count}/${adminStatus.total_admin_count})`
                        : "Admin Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesEndRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-[#292A2B]"
              style={{ scrollBehavior: "smooth" }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-[#9CA3AF]">Loading messages...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-[#9CA3AF]">
                    No messages yet. Start the conversation!
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  // Check if message is from current user (admin)
                  const currentUserId = parseInt(
                    localStorage.getItem("userId")
                  );
                  const isFromCurrentUser =
                    message.from_user_id === currentUserId;
                  const isEquipmentRequest =
                    message.message_type === "equipment_request";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isFromCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isEquipmentRequest
                            ? "bg-[#FDCE06] text-[#1F1F20] border-2 border-[#E5B800]"
                            : isFromCurrentUser
                              ? "bg-[#FDCE06] text-[#1F1F20]"
                              : "bg-[#1F1F20] text-[#E5E5E5] border border-[#333333]"
                        }`}
                      >
                        {isEquipmentRequest && (
                          <div className="mb-2">
                            <span className="text-xs font-bold bg-[#1F1F20] text-[#FDCE06] px-2 py-1 rounded">
                              Bulldozer Required
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                        {message.equipment_name && (
                          <div className="mt-2 text-xs opacity-80">
                            Equipment: {message.equipment_name}
                          </div>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            isFromCurrentUser
                              ? "text-[#1F1F20] opacity-70"
                              : "text-[#9CA3AF]"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="bg-[#1F1F20] border-t border-[#333333] p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message here..."
                    className="w-full bg-[#292A2B] text-[#E5E5E5] placeholder-[#9CA3AF] p-3 rounded-lg border border-[#333333] focus:border-[#FDCE06] focus:outline-none resize-none"
                    rows="1"
                    style={{
                      minHeight: "44px",
                      maxHeight: "120px",
                      resize: "none",
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || loading}
                  className="bg-[#FDCE06] text-[#1F1F20] p-3 rounded-lg hover:bg-[#E5B800] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9 22,2" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#292A2B]">
            <div className="text-center">
              <h3 className="text-[#E5E5E5] text-xl font-semibold mb-2">
                Select a conversation
              </h3>
              <p className="text-[#9CA3AF]">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Client Selection Modal */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F20] border border-[#333333] rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-[#E5E5E5] text-lg font-semibold mb-4">
              Start New Conversation
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#E5E5E5] text-sm font-medium mb-2">
                  Select Client
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-[#292A2B] text-[#E5E5E5] border border-[#333333] rounded-lg px-3 py-2 focus:border-[#FDCE06] focus:outline-none"
                >
                  <option value="">Choose a client...</option>
                  {clients
                    .filter((client) => client.has_conversation === 0)
                    .map((client) => (
                      <option key={client.user_id} value={client.user_id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewConversationModal(false)}
                  className="flex-1 bg-[#333333] text-[#E5E5E5] py-2 px-4 rounded-lg hover:bg-[#404040] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartConversation}
                  disabled={!selectedClientId}
                  className="flex-1 bg-[#FDCE06] text-[#1F1F20] py-2 px-4 rounded-lg hover:bg-[#E5B800] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
