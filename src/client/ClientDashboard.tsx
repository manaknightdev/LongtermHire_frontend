import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clientAuthApi } from "../services/clientAuthApi";
import { clientEquipmentApi } from "../services/clientEquipmentApi";
import { chatApi } from "../services/chatApi";
import { useClientChat } from "../hooks/useClientChat";
import EquipmentDetailsModal from "../components/EquipmentDetailsModal";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(
    "CAT 320 Hydraulic Excavator"
  );
  const [selectedDuration, setSelectedDuration] = useState("3 months");
  const [requestLoading, setRequestLoading] = useState({});
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for scroll management
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Use real chat functionality
  const {
    conversations,
    messages,
    loading: chatLoading,
    error: chatError,
    loadConversations,
    sendMessage,
    clearError: clearChatError,
  } = useClientChat();

  // Load client data and equipment on component mount
  useEffect(() => {
    const loadClientData = async () => {
      try {
        // Check if client is authenticated
        if (!clientAuthApi.isAuthenticated()) {
          navigate("/client/login");
          return;
        }

        setLoading(true);

        // Load client profile
        const clientInfo = clientAuthApi.getClientInfo();
        setUser({
          name: clientInfo.profile?.name || clientInfo.email || "Client User",
          email: clientInfo.email,
        });

        // Load equipment from API
        const equipmentResponse = await clientEquipmentApi.getEquipment();
        console.log("Equipment API response:", equipmentResponse);

        if (equipmentResponse && equipmentResponse.equipment) {
          setEquipment(equipmentResponse.equipment);

          if (equipmentResponse.equipment.length > 0) {
            setSelectedEquipment(equipmentResponse.equipment[0].equipment_name);
          }
        } else {
          console.log("No equipment assigned to this client");
          setEquipment([]);
        }
      } catch (error) {
        console.error("Error loading client data:", error);
        setError("Failed to load data. Please try again.");
        // Set empty equipment array on error
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [navigate]);

  // Load chat conversations
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      const container = messagesContainerRef.current;
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

  // Effect to scroll to bottom when chat opens
  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 200);
    }
  }, [isChatOpen]);

  // Process equipment data from API and organize by categories
  const getEquipmentData = () => {
    if (!equipment || equipment.length === 0) {
      return {};
    }

    // Group equipment by category
    const grouped = equipment.reduce((acc, item) => {
      const category = item.category_name?.toLowerCase() || "other";
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({
        id: item.equipment_id || item.id,
        name: item.equipment_name,
        status: item.availability === 1 ? "Available" : "Unavailable",
        description:
          item.content?.description || `${item.equipment_name} equipment`,
        price: item.base_price ? `$${item.base_price}` : "Contact for pricing",
        image: item.content?.image || "/figma-assets/equipment-placeholder.jpg",
        category: item.category_name,
      });

      return acc;
    }, {});

    return grouped;
  };

  const equipmentData = getEquipmentData();

  const handleLogout = async () => {
    try {
      await clientAuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      clientAuthApi.logout();
    }
  };

  // Handle equipment request
  const handleRequestEquipment = async (equipment) => {
    try {
      // Set loading state for this specific equipment
      setRequestLoading((prev) => ({ ...prev, [equipment.id]: true }));

      // Send equipment request via chat
      const response = await chatApi.sendEquipmentRequest({
        equipment_id: equipment.id,
        equipment_name: equipment.name,
        message: `I would like to request the ${equipment.name} for ${selectedDuration}.`,
      });

      if (!response.error) {
        toast.success(
          "Equipment request sent successfully! Check your messages for updates."
        );

        // The equipment request automatically creates a chat message via the API
        // Reload conversations to show the new message
        await loadConversations();
      } else {
        toast.error(
          response.message || "Failed to send request. Please try again."
        );
      }
    } catch (error) {
      console.error("Request equipment error:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      // Clear loading state
      setRequestLoading((prev) => ({ ...prev, [equipment.id]: false }));
    }
  };

  // Calculate slider position based on selected duration
  const getSliderPosition = () => {
    switch (selectedDuration) {
      case "1 month":
        return { barWidth: "25%", circleLeft: "20%" }; // Start position
      case "3 months":
        return { barWidth: "50%", circleLeft: "45%" }; // Middle position
      case "12 months":
        return { barWidth: "100%", circleLeft: "95%" }; // End position
      default:
        return { barWidth: "50%", circleLeft: "45%" }; // Default to middle
    }
  };

  // Calculate discount based on selected duration
  const getDiscountAmount = () => {
    switch (selectedDuration) {
      case "1 month":
        return 50; // $50 discount for 1 month
      case "3 months":
        return 105; // $105 discount for 3 months
      case "12 months":
        return 500; // $500 discount for 12 months
      default:
        return 105; // Default to 3 months discount
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || conversations.length === 0 || sendingMessage) {
      return; // Prevent sending if already sending or no message/conversation
    }

    try {
      setSendingMessage(true);

      // Get the admin user ID from the conversation
      const conversation = conversations[0];
      const currentUserId = localStorage.getItem("user_id");
      const adminUserId =
        conversation.user1_id == currentUserId
          ? conversation.user2_id
          : conversation.user1_id;

      const success = await sendMessage(adminUserId, messageText);
      if (success) {
        setMessageText("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-[rgba(34,197,94,0.2)] text-[#22C55E]";
      case "Limited":
        return "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]";
      case "Booked":
      case "Unavailable":
        return "bg-[rgba(239,68,68,0.2)] text-[#EF4444]";
      default:
        return "bg-[rgba(156,163,175,0.2)] text-[#9CA3AF]";
    }
  };

  const getButtonClass = (status) => {
    if (status === "Booked" || status === "Unavailable") {
      return "bg-[#6B7280] text-[#D1D5DB] cursor-not-allowed";
    }
    return "bg-[#FDCE06] text-[#000000] hover:bg-[#E5B800]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#292A2B] flex items-center justify-center">
        <div className="text-center">
          <ClipLoader color="#FDCE06" size={50} />
          <div className="text-[#E5E5E5] font-[Inter] mt-4">
            Loading your equipment...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#292A2B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-[Inter] mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FDCE06] text-[#000000] px-4 py-2 rounded-md font-bold hover:bg-[#E5B800] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292A2B] font-[Inter]">
      {/* Header */}
      <header className="bg-[#1F1F20] border-b border-[#333333] px-4 sm:px-8 lg:px-20 py-5">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto">
          <div className="flex items-center">
            <img
              src="/login-logo.png"
              alt="Equipment Rental Logo"
              className="h-[70px] sm:h-[70px] mr-4 sm:mr-6"
            />
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
              <span className="text-[#9CA3AF] text-xs sm:text-sm hidden sm:block">
                Welcome, {user?.name}
              </span>
              <button
                onClick={() => navigate("/client/profile")}
                className="text-[#E5E5E5] text-xs sm:text-sm hover:text-[#FDCE06] transition-colors"
              >
                Profile
              </button>
              <span className="text-[#9CA3AF] text-xs sm:text-sm">|</span>
              <button
                onClick={handleLogout}
                className="text-[#E5E5E5] text-xs sm:text-sm hover:text-[#FDCE06] transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-20 py-6 lg:py-8 lg:max-w-[866px] xl:max-w-full">
          <div className="max-w-full lg:max-w-[810px]">
            {/* Project Name */}
            <div className="mb-12 lg:mb-22">
              <h1 className="text-[#FFFFFF] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Longterm Hire
              </h1>
            </div>

            {/* Dynamic Equipment Sections */}
            {Object.keys(equipmentData).length === 0 ? (
              <section className="mb-12 lg:mb-16">
                <div className="text-center py-12">
                  <div className="text-[#9CA3AF] text-lg mb-4">
                    No equipment assigned to your account
                  </div>
                  <div className="text-[#9CA3AF] text-sm">
                    Please contact your administrator to assign equipment to
                    your account.
                  </div>
                </div>
              </section>
            ) : (
              Object.entries(equipmentData).map(([category, items]) => (
                <section key={category} className="mb-12 lg:mb-16">
                  <h2 className="text-[#D1D5DB] text-xl sm:text-2xl font-semibold mb-8 lg:mb-12 capitalize">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {items.map((equipment) => (
                      <div
                        key={equipment.id}
                        className="bg-[#1F1F20] border border-[#333333] rounded-lg overflow-hidden hover:border-[#444444] transition-colors"
                      >
                        <div className="p-3 sm:p-4">
                          <div className="bg-[#292A2B] rounded-md p-0 mb-3 sm:mb-4">
                            <img
                              src={
                                equipment?.image
                                  ? equipment.image
                                  : "/placeholder-equipment.jpg"
                              }
                              alt={equipment.name}
                              className="w-full h-28 sm:h-32 object-cover rounded-md"
                              // onError={(e) => {
                              //   e.target.src = "/placeholder-equipment.jpg";
                              // }}
                            />
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[#FFFFFF] text-sm font-bold flex-1">
                                {equipment.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(
                                  equipment.status
                                )}`}
                              >
                                {equipment.status}
                              </span>
                            </div>
                            <p className="text-[#9CA3AF] text-xs leading-relaxed">
                              {equipment.description}
                            </p>
                            <p className="text-[#FFFFFF] text-sm font-semibold">
                              {equipment.price}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={() =>
                                  handleRequestEquipment(equipment)
                                }
                                disabled={
                                  equipment.status === "Booked" ||
                                  requestLoading[equipment.id]
                                }
                                className={`px-3 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${getButtonClass(
                                  equipment.status
                                )}`}
                              >
                                {requestLoading[equipment.id] ? (
                                  <>
                                    <ClipLoader size={12} color="#1F1F20" />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  "Request"
                                )}
                              </button>
                              <div className="w-5 h-5 flex items-center justify-center"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[389px] p-4 sm:p-6 lg:p-8 lg:pt-[168px] order-first lg:order-last">
          <div className="space-y-6 lg:space-y-8">
            {/* Equipment Selector */}
            <div className="bg-[#1F1F20] border border-[#333333] rounded-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <label className="block text-[#D1D5DB] text-sm font-medium mb-3 sm:mb-4">
                  Select Equipment
                </label>
                <div className="relative">
                  <select
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                    className="w-full bg-[#2A2A2B] border border-[#444444] rounded-md px-3 py-3 text-[#FFFFFF] text-sm sm:text-base appearance-none cursor-pointer"
                  >
                    {equipment.length === 0 ? (
                      <option value="">No equipment assigned</option>
                    ) : (
                      equipment.map((item) => (
                        <option
                          key={item.equipment_id || item.id}
                          value={item.equipment_name}
                        >
                          {item.equipment_name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hire Duration */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[#FFFFFF] text-base sm:text-lg font-semibold">
                    Hire For
                  </span>
                  <span className="text-[#22C55E] text-base sm:text-lg font-bold">
                    -${getDiscountAmount()}
                  </span>
                </div>
                <div className="relative mb-4 sm:mb-6">
                  <div className="bg-[#E5E5E5] border border-[#B7B5B5] rounded-full h-2 relative">
                    <div
                      className="absolute left-0 top-0 bg-[#0075FF] rounded-full h-2 transition-all duration-300 ease-in-out"
                      style={{ width: getSliderPosition().barWidth }}
                    ></div>
                    <div
                      className="absolute top-[-9px] bg-[#0075FF] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 ease-in-out"
                      style={{
                        left: getSliderPosition().circleLeft,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <circle cx="9" cy="9" r="7.5" fill="white" />
                        <circle cx="9" cy="9" r="3" fill="#0075FF" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <button
                    onClick={() => setSelectedDuration("1 month")}
                    className={`${
                      selectedDuration === "1 month"
                        ? "text-[#FDCE06] font-bold"
                        : "text-[#9CA3AF]"
                    } transition-colors`}
                  >
                    1 month
                  </button>
                  <button
                    onClick={() => setSelectedDuration("3 months")}
                    className={`${
                      selectedDuration === "3 months"
                        ? "text-[#FDCE06] font-bold"
                        : "text-[#9CA3AF]"
                    } transition-colors`}
                  >
                    3 months
                  </button>
                  <button
                    onClick={() => setSelectedDuration("12 months")}
                    className={`${
                      selectedDuration === "12 months"
                        ? "text-[#FDCE06] font-bold"
                        : "text-[#9CA3AF]"
                    } transition-colors`}
                  >
                    12 months
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Section - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block bg-[#1F1F20] border border-[#333333] rounded-lg overflow-hidden">
              <div className="bg-[#1F1F20] border-b border-[#333333] px-4 py-4">
                <h3 className="text-[#FFFFFF] text-base font-semibold">
                  Message Rental Company
                </h3>
              </div>
              <div className="p-4 space-y-4 h-[400px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#9CA3AF]">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    // Get current user ID from localStorage (client side)
                    const currentUserId = parseInt(
                      localStorage.getItem("clientUserId")
                    );
                    const isCurrentUser =
                      message.from_user_id === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[280px] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-[#FDCE06] text-[#000000]"
                              : "bg-[#292A2B] text-[#E5E5E5]"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="border-t border-[#333333] p-4">
                <div className="flex items-start bg-[#2A2A2B] border border-[#444444] rounded-lg px-4 py-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message... "
                    className="flex-1 bg-transparent text-[#ADAEBC] text-sm sm:text-base placeholder-[#ADAEBC] placeholder:text-xs outline-none resize-none min-h-[32px] max-h-[100px] overflow-y-auto"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#444444 transparent",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !messageText.trim()}
                    className="ml-2 bg-[#FDCE06] rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-[#E5B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 14L14 8L2 2L2 6L10 8L2 10L2 14Z"
                          fill="#000000"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Chat Button - Only visible on mobile/tablet */}
      <div className="fixed bottom-4 right-4 lg:hidden z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#FDCE06] hover:bg-[#E5B800] rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            className="sm:w-5 sm:h-5"
          >
            <path
              d="M18 8.5C18 12.6421 14.6421 16 10.5 16H4L2 18V4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V8.5Z"
              fill="#000000"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Chat Popup */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F20] border-t border-[#333333] rounded-t-lg max-h-[80vh] flex flex-col">
            <div className="bg-[#1F1F20] border-b border-[#333333] px-4 py-4 flex items-center justify-between">
              <h3 className="text-[#FFFFFF] text-base font-semibold">
                Message Rental Company
              </h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div
              ref={messagesContainerRef}
              className="p-4 space-y-4 flex-1 overflow-y-auto scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#9CA3AF]">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  // Get current user ID from localStorage
                  const currentUserId = localStorage.getItem("user_id");
                  const isCurrentUser = message.from_user_id == currentUserId;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-[#FDCE06] text-[#000000]"
                            : "bg-[#292A2B] text-[#E5E5E5]"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-[#333333] p-4">
              <div className="flex items-start bg-[#2A2A2B] border border-[#444444] rounded-lg px-4 py-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message... "
                  className="flex-1 bg-transparent text-[#ADAEBC] text-sm placeholder-[#ADAEBC] outline-none placeholder:text-xs resize-none min-h-[32px] max-h-[100px] overflow-y-auto"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#444444 transparent",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="ml-2 bg-[#FDCE06] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#E5B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 14L14 8L2 2L2 6L10 8L2 10L2 14Z"
                        fill="#000000"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default ClientDashboard;
