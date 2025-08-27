// @ts-nocheck
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clientAuthApi } from "../services/clientAuthApi";
import { clientEquipmentApi } from "../services/clientEquipmentApi";
import { chatApi } from "../services/chatApi";
import { dashboardApi } from "../services/dashboardApi";
import { useClientChat } from "../hooks/useClientChat";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add custom CSS for scrollbar hiding and range input styling
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #0075FF;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #0075FF;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

// Inject the styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = scrollbarHideStyles;
document.head.appendChild(styleSheet);

// Format currency with English locale and thousands separators
const formatCurrency = (value) => {
  const number = typeof value === "number" ? value : parseFloat(value || 0);
  const safeNumber = Number.isFinite(number) ? number : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber);
};

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
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected image for each equipment
  const [imageObjectFit, setImageObjectFit] = useState({}); // Track object-fit class for each image
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewEquipment, setQuickViewEquipment] = useState(null);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0); // Track scroll position
  const [unreadMessageCount, setUnreadMessageCount] = useState(0); // Track unread messages
  // const [hasMoreMessages, setHasMoreMessages] = useState(true);
  // const [loadingMore, setLoadingMore] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Refs for scroll management
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Use real chat functionality with online status
  const {
    conversations,
    messages,
    loading: chatLoading,
    error: chatError,
    adminOnline,
    adminStatus,
    hasMoreMessages,
    loadingMore,
    currentPage,
    unreadCount: hookUnreadCount,
    loadConversations,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    startPolling,
    stopPolling,
    clearMessages,
    clearUnreadCount,
    clearError: clearChatError,
  } = useClientChat();

  // Get current user ID - simple approach
  const getCurrentUserId = () => {
    const clientUserId = localStorage.getItem("clientUserId");
    const userId = localStorage.getItem("user_id");
    console.log("Getting user ID:", { clientUserId, userId });
    return parseInt(clientUserId || userId || "0");
  };

  // Group messages by date for date headers
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

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

        if (
          equipmentResponse &&
          equipmentResponse.data &&
          equipmentResponse.data.equipment
        ) {
          setEquipment(equipmentResponse.data.equipment);

          if (equipmentResponse.data.equipment.length > 0) {
            const firstEquipment = equipmentResponse.data.equipment[0];
            setSelectedEquipment(firstEquipment.equipment_name);

            // Set initial duration to minimum duration of first equipment
            const minDuration = firstEquipment.minimum_duration;
            if (minDuration) {
              const match = minDuration.match(/(\d+)/);
              const minMonths = match ? parseInt(match[1]) : 1;
              setSelectedDuration(
                `${minMonths} month${minMonths > 1 ? "s" : ""}`
              );
            }
          }
        } else if (equipmentResponse && equipmentResponse.equipment) {
          // Fallback for old API structure
          setEquipment(equipmentResponse.equipment);

          if (equipmentResponse.equipment.length > 0) {
            const firstEquipment = equipmentResponse.equipment[0];
            setSelectedEquipment(firstEquipment.equipment_name);

            // Set initial duration to minimum duration of first equipment
            const minDuration = firstEquipment.minimum_duration;
            if (minDuration) {
              const match = minDuration.match(/(\d+)/);
              const minMonths = match ? parseInt(match[1]) : 1;
              setSelectedDuration(
                `${minMonths} month${minMonths > 1 ? "s" : ""}`
              );
            }
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

  // Preload images for better performance
  const preloadImages = useCallback((images) => {
    if (images && Array.isArray(images)) {
      images.forEach((img) => {
        if (img.image_url) {
          const imgElement = new Image();
          imgElement.onload = () => {
            const { naturalWidth, naturalHeight } = imgElement;
            const aspectRatio = naturalWidth / naturalHeight;
            const is4by3 = Math.abs(aspectRatio - 4 / 3) < 0.1; // Allow small tolerance
            const objectFitClass = is4by3 ? "object-fill" : "object-cover";

            // Store the object-fit class for this image
            setImageObjectFit((prev) => ({
              ...prev,
              [img.image_url]: objectFitClass,
            }));
          };
          imgElement.src = img.image_url;
        }
      });
    }
  }, []);

  // Check if image has 4:3 aspect ratio and return appropriate object-fit class
  const getImageObjectFit = useCallback((imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const aspectRatio = naturalWidth / naturalHeight;
        const is4by3 = Math.abs(aspectRatio - 4 / 3) < 0.1; // Allow small tolerance
        resolve(is4by3 ? "object-fill" : "object-cover");
      };
      img.onerror = () => {
        resolve("object-cover"); // Default fallback
      };
      img.src = imageUrl;
    });
  }, []);

  // Preload all equipment images for better performance
  useEffect(() => {
    if (equipment && equipment.length > 0) {
      equipment.forEach((item) => {
        if (item.content?.images && Array.isArray(item.content.images)) {
          preloadImages(item.content.images);
        }
      });
    }
  }, [equipment, preloadImages]);

  // Initialize selected images with main images (is_main: 1) for each equipment
  useEffect(() => {
    if (equipment && equipment.length > 0) {
      const initialSelectedImages = {};
      equipment.forEach((item) => {
        if (item.content?.images && Array.isArray(item.content.images)) {
          const mainImageIndex = item.content.images.findIndex(
            (img) => img.is_main === 1
          );
          if (mainImageIndex !== -1) {
            initialSelectedImages[item.equipment_id || item.id] =
              mainImageIndex;
          }
        }
      });
      setSelectedImages(initialSelectedImages);
    }
  }, [equipment]);

  // Track scroll position for dynamic positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.pageYOffset || document.documentElement.scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load chat conversations and start polling
  useEffect(() => {
    const initializeChat = async () => {
      await loadConversations();

      // Start polling if there are conversations
      if (conversations.length > 0) {
        const firstConversation = conversations[0];
        startPolling(firstConversation.id);
      }
    };

    initializeChat();
  }, [loadConversations, conversations.length, startPolling]);

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

  // Enhanced scroll to bottom for chat sections
  const scrollChatToBottom = (force = false) => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Effect to handle auto-scroll when messages change
  useEffect(() => {
    const currentMessageCount = messages.length;
    const previousMessageCount = lastMessageCountRef.current;

    if (currentMessageCount > previousMessageCount) {
      // New message arrived, scroll to bottom
      scrollChatToBottom(true);

      // Check if new message is from admin and chat is not visible
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        const currentUserId = getCurrentUserId();

        // If message is from admin (not from current user) and chat is hidden
        if (latestMessage.from_user_id !== currentUserId && !isChatVisible) {
          // Auto-open the chat when new message arrives from admin
          setIsChatVisible(true);

          // Show notification toast
          toast.info("New message received! Chat opened automatically.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages, isChatVisible]);

  // Use unread count from API
  useEffect(() => {
    if (hookUnreadCount !== undefined && hookUnreadCount >= 0) {
      setUnreadMessageCount(hookUnreadCount);

      // Auto-open chat if there are unread messages and chat is hidden
      if (hookUnreadCount > 0 && !isChatVisible) {
        setIsChatVisible(true);
        toast.info(
          `${hookUnreadCount} unread message${hookUnreadCount > 1 ? "s" : ""} from admin!`,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      }
    }
  }, [hookUnreadCount, isChatVisible]);

  // Mark messages as read when chat becomes visible
  useEffect(() => {
    if ((isChatVisible || isChatOpen) && messages.length > 0) {
      // Call API to mark messages as read when chat is opened
      const markMessagesRead = async () => {
        try {
          const messageIds = messages
            .filter(
              (msg) =>
                !msg.read_at &&
                parseInt(msg.from_user_id) !== getCurrentUserId()
            )
            .map((msg) => msg.id);

          if (messageIds.length > 0) {
            await dashboardApi.markMessagesAsRead(messageIds);
          }
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      };

      markMessagesRead();
    }
  }, [isChatVisible, isChatOpen, messages]);

  // Effect to scroll to bottom when chat opens
  useEffect(() => {
    if ((isChatOpen || isChatVisible) && messages.length > 0) {
      scrollChatToBottom(true);
    }
  }, [isChatOpen, isChatVisible]);

  // Process equipment data from API and organize by categories with discount support
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

      // Equipment cards show price per month
      const priceDisplay =
        item.base_price !== undefined && item.base_price !== null
          ? `${formatCurrency(item.base_price)}/month`
          : "Contact for pricing";

      // Create discount info object
      const hasDiscount = item.discount_type && item.discount_value;
      const discountInfo = hasDiscount
        ? {
            has_discount: true,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            original_price: item.base_price,
            discounted_price: null, // Will be calculated dynamically
            pricing_package: item.pricing_package,
          }
        : {
            has_discount: false,
            discount_type: null,
            discount_value: null,
            original_price: item.base_price,
            discounted_price: null,
            pricing_package: null,
          };

      // Handle multiple images - get all images and determine main display image
      let allImages = [];
      let mainImage = "/figma-assets/equipment-placeholder.jpg";

      if (
        item.content?.images &&
        Array.isArray(item.content.images) &&
        item.content.images.length > 0
      ) {
        // Use new multiple images structure
        allImages = item.content.images;
        // Get the currently selected image or default to main image
        const selectedImageIndex =
          selectedImages[item.equipment_id || item.id] || 0;
        mainImage =
          allImages[selectedImageIndex]?.image_url ||
          allImages.find((img) => img.is_main == 1)?.image_url ||
          allImages[0]?.image_url ||
          "/figma-assets/equipment-placeholder.jpg";
      } else if (item.content?.image) {
        // Fallback to single image
        mainImage = item.content.image;
        allImages = [
          { image_url: item.content.image, caption: item.equipment_name },
        ];
      }

      acc[category].push({
        id: item.equipment_id || item.id,
        name: item.equipment_name,
        status: item.availability === 1 ? "Available" : "Unavailable",
        description:
          item.content?.description || `${item.equipment_name} equipment`,
        banner_description: item.content?.banner_description || null,
        price: priceDisplay,
        base_price: item.base_price,
        discounted_price: item.discounted_price,
        image: mainImage,
        allImages: allImages,
        category: item.category_name,
        discount: discountInfo,
      });

      return acc;
    }, {});

    return grouped;
  };

  const equipmentData = getEquipmentData();

  console.log(equipmentData);

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

  // Get minimum duration for selected equipment
  const getMinimumDuration = () => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );
    if (!selectedEquipmentData?.minimum_duration) {
      return 1; // Default to 1 month
    }

    // Extract number from "4 Months" format
    const match = selectedEquipmentData.minimum_duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  // Get available durations from minimum to 12 months
  const getAvailableDurations = () => {
    const minDuration = getMinimumDuration();
    const durations = [];

    for (let i = minDuration; i <= 12; i++) {
      durations.push(`${i} month${i > 1 ? "s" : ""}`);
    }

    return durations;
  };

  // Removed custom slider functions - now using native range input

  // Get selected duration in months
  const getSelectedDurationMonths = () => {
    const match = selectedDuration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  // Calculate duration-adjusted base price
  const getDurationAdjustedBasePrice = () => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );

    if (!selectedEquipmentData?.base_price) return 0;

    const basePrice = selectedEquipmentData.base_price;
    const minDuration = getMinimumDuration();
    const selectedDurationMonths = getSelectedDurationMonths();

    // Base price is for minimum duration, scale proportionally
    const multiplier = selectedDurationMonths / minDuration;
    return basePrice * multiplier;
  };

  // Memoized equipment discount calculation
  const equipmentDiscount = useMemo(() => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );

    if (!selectedEquipmentData) return 0;

    const { discount_type, discount_value, base_price } = selectedEquipmentData;
    const selectedDurationMonths = getSelectedDurationMonths();

    // STANDARD 1% compounding discount for ALL hires (hardcoded)
    let standardCompoundingCost = 0;
    let currentMonthPrice = base_price;

    for (let month = 1; month <= selectedDurationMonths; month++) {
      standardCompoundingCost += currentMonthPrice;
      // Next month's price is discounted by 1% from current month's price
      currentMonthPrice = currentMonthPrice * 0.99; // 1% discount = 99% of previous price
    }

    // Calculate standard discount (difference between simple multiplication and compounding)
    const simpleTotalCost = base_price * selectedDurationMonths;
    const standardDiscount = simpleTotalCost - standardCompoundingCost;

    // Add any additional pricing package discount
    let packageDiscount = 0;
    if (discount_type && discount_value) {
      if (discount_type === "fixed") {
        packageDiscount = discount_value;
      } else if (discount_type === "percentage") {
        // Percentage discount applied to the standard compounding cost
        packageDiscount = standardCompoundingCost * (discount_value / 100);
      }
    }

    return parseFloat((standardDiscount + packageDiscount).toFixed(2));
  }, [equipment, selectedEquipment, selectedDuration]);

  // Memoized final price calculation
  const finalPrice = useMemo(() => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );

    if (!selectedEquipmentData?.base_price) return 0;

    const { discount_type, discount_value, base_price } = selectedEquipmentData;
    const selectedDurationMonths = getSelectedDurationMonths();

    // STANDARD 1% compounding discount for ALL hires (hardcoded)
    let standardCompoundingCost = 0;
    let currentMonthPrice = base_price;

    for (let month = 1; month <= selectedDurationMonths; month++) {
      standardCompoundingCost += currentMonthPrice;
      // Next month's price is discounted by 1% from current month's price
      currentMonthPrice = currentMonthPrice * 0.99; // 1% discount = 99% of previous price
    }

    // Apply any additional pricing package discount on top of the standard compounding cost
    let finalCost = standardCompoundingCost;
    if (discount_type && discount_value) {
      if (discount_type === "fixed") {
        finalCost = standardCompoundingCost - discount_value;
      } else if (discount_type === "percentage") {
        // Percentage discount applied to the standard compounding cost
        finalCost = standardCompoundingCost * (1 - discount_value / 100);
      }
    }

    return parseFloat(Math.max(0, finalCost).toFixed(2));
  }, [equipment, selectedEquipment, selectedDuration]);

  // Memoized discount percentage calculation
  const discountPercentage = useMemo(() => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );

    if (!selectedEquipmentData?.base_price) return 0;

    const selectedDurationMonths = getSelectedDurationMonths();
    const basePrice = selectedEquipmentData.base_price;

    // Calculate the effective percentage discount from the standard 1% compounding
    const simpleTotalCost = basePrice * selectedDurationMonths;

    // Calculate standard compounding cost
    let standardCompoundingCost = 0;
    let currentMonthPrice = basePrice;

    for (let month = 1; month <= selectedDurationMonths; month++) {
      standardCompoundingCost += currentMonthPrice;
      currentMonthPrice = currentMonthPrice * 0.99;
    }

    const standardDiscount = simpleTotalCost - standardCompoundingCost;
    const standardDiscountPercentage =
      (standardDiscount / simpleTotalCost) * 100;

    return parseFloat(standardDiscountPercentage.toFixed(2));
  }, [equipment, selectedEquipment, selectedDuration]);

  // Handle image selection for equipment
  const handleImageSelect = (equipmentId, imageIndex) => {
    setSelectedImages((prev) => ({
      ...prev,
      [equipmentId]: imageIndex,
    }));
  };

  // Get the current main image for an equipment item
  const getMainImageSrc = useCallback(
    (equipment) => {
      if (equipment?.allImages && equipment.allImages.length > 0) {
        const selectedIndex = selectedImages[equipment.id];

        // If there's a selected image, use it
        if (selectedIndex !== undefined && selectedIndex >= 0) {
          return (
            equipment.allImages[selectedIndex]?.image_url ||
            equipment.image ||
            "/images/graphview.png"
          );
        }

        // Otherwise, find and use the main image (is_main: 1)
        const mainImage = equipment.allImages.find((img) => img.is_main === 1);
        if (mainImage) {
          return mainImage.image_url;
        }

        // Fallback to first image, then equipment.image, then placeholder
        return (
          equipment.allImages[0]?.image_url ||
          equipment.image ||
          "/images/graphview.png"
        );
      }
      return equipment?.image || "/images/graphview.png";
    },
    [selectedImages]
  );

  // Get monthly breakdown for compounding discount
  const getMonthlyBreakdown = () => {
    const selectedEquipmentData = equipment.find(
      (item) => item.equipment_name === selectedEquipment
    );

    if (!selectedEquipmentData?.base_price) return [];

    const { discount_type, discount_value, base_price } = selectedEquipmentData;
    const selectedDurationMonths = getSelectedDurationMonths();

    if (discount_type === "percentage" && discount_value) {
      const breakdown = [];
      let currentMonthPrice = base_price;

      for (let month = 1; month <= selectedDurationMonths; month++) {
        breakdown.push({
          month,
          price: parseFloat(currentMonthPrice.toFixed(2)),
          discount:
            month === 1
              ? 0
              : parseFloat((base_price - currentMonthPrice).toFixed(2)),
        });
        // Next month's price is discounted from current month's price
        currentMonthPrice = currentMonthPrice * (1 - discount_value / 100);
      }

      return breakdown;
    }

    return [];
  };

  const handleSendMessage = async () => {
    console.log("hi");
    if (!messageText.trim() || sendingMessage) {
      return; // Prevent sending if already sending or no message/conversation
    }

    try {
      setSendingMessage(true);

      // Get the admin user ID from the conversation
      const conversation = conversations?.[0];
      const currentUserId = getCurrentUserId();
      console.log(currentUserId);
      console.log("kdj");
      const adminUserId =
        parseInt(conversation?.user1_id) === currentUserId
          ? conversation?.user2_id
          : 2;
      console.log("done");
      const success = await sendMessage(adminUserId, messageText);
      if (success) {
        setMessageText("");
        // Force a small delay to ensure the message is properly added before re-render
        setTimeout(() => {
          // This will trigger a re-render with the new message
        }, 100);
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
      <header className="bg-[#1F1F20] border-b border-[#333333] px-4 sm:px-8 lg:px-5 py-2">
        <div className="flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <img
              src="/login-logo.png"
              alt="Equipment Rental Logo"
              className="h-[100px] sm:h-[100px] mr-4 sm:mr-6"
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
        <main className="flex-1 px-4 sm:px-8 lg:px-20 pb-[100px] py-6 lg:py-8 lg:max-w-[866px] xl:max-w-full">
          <div className="max-w-full lg:max-w-[810px]">
            {/* Project Name */}
            {/* <div className="mb-12 lg:mb-22">
              <h1 className="text-[#FFFFFF] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Longterm Hire
              </h1>
            </div> */}

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
                  <div className="grid grid-cols-1 justify-items-center  sm:justify-items-[unset] sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {items.map((equipment) => (
                      <div
                        key={equipment.id}
                        className="bg-[#1F1F20] w-[248px]  h-[444px] border border-[#333333] rounded-lg overflow-hidden hover:border-[#444444] transition-colors cursor-pointer"
                        onClick={() => {
                          setQuickViewEquipment(equipment);
                          setQuickViewImageIndex(
                            selectedImages[equipment.id] || 0
                          );
                          setIsQuickViewOpen(true);
                        }}
                      >
                        <div className="p-3 sm:p-4">
                          <div className=" rounded-md p-0   relative aspect-[4/3]">
                            {/* Main Image */}
                            <img
                              key={`${equipment.id}-${selectedImages[equipment.id] || 0}`}
                              src={getMainImageSrc(equipment)}
                              alt={equipment.name}
                              className={`w-full h-28 sm:h-32 rounded-md transition-all duration-300 ease-in-out ${
                                imageObjectFit[getMainImageSrc(equipment)] ||
                                "object-cover"
                              }`}
                              onError={(e) => {
                                e.target.src = "/images/graphview.png";
                              }}
                            />
                            {/* Image Counter Badge */}
                            {equipment?.allImages &&
                              equipment.allImages.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                  {(selectedImages[equipment.id] || 0) + 1} /{" "}
                                  {equipment.allImages.length}
                                </div>
                              )}
                          </div>

                          {/* Horizontal Thumbnail Strip */}
                          {equipment?.allImages &&
                            equipment.allImages.length > 1 && (
                              <div className="relative group">
                                {/* Left Arrow - Show only when there are enough thumbnails to scroll */}
                                {equipment.allImages.length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const container =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".thumbnail-scroll"
                                        );
                                      if (container) {
                                        container.scrollLeft -= 80; // Scroll by thumbnail width + gap
                                      }
                                    }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1F1F20] border border-[#333333] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2A2A2B] hover:border-[#444444] shadow-lg lg:hidden"
                                    title="Scroll left"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                      />
                                    </svg>
                                  </button>
                                )}

                                {/* Left Arrow for Large Screens - Show only when more than 3 thumbnails */}
                                {equipment.allImages.length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const container =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".thumbnail-scroll"
                                        );
                                      if (container) {
                                        container.scrollLeft -= 80; // Scroll by thumbnail width + gap
                                      }
                                    }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1F1F20] border border-[#333333] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2A2A2B] hover:border-[#444444] shadow-lg hidden lg:flex"
                                    title="Scroll left"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                      />
                                    </svg>
                                  </button>
                                )}

                                {/* Right Arrow - Show only when there are enough thumbnails to scroll */}
                                {equipment.allImages.length > 5 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const container =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".thumbnail-scroll"
                                        );
                                      if (container) {
                                        container.scrollLeft += 80; // Scroll by thumbnail width + gap
                                      }
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1F1F20] border border-[#333333] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2A2A2B] hover:border-[#444444] shadow-lg lg:hidden"
                                    title="Scroll right"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                )}

                                {/* Right Arrow for Large Screens - Show only when more than 3 thumbnails */}
                                {equipment.allImages.length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const container =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".thumbnail-scroll"
                                        );
                                      if (container) {
                                        container.scrollLeft += 80; // Scroll by thumbnail width + gap
                                      }
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1F1F20] border border-[#333333] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2A2A2B] hover:border-[#444444] shadow-lg hidden lg:flex"
                                    title="Scroll right"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                )}

                                <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide thumbnail-scroll scroll-smooth">
                                  {equipment.allImages.map((img, index) => {
                                    const isSelected =
                                      selectedImages[equipment.id] === index;
                                    return (
                                      <div
                                        key={index}
                                        className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                          isSelected
                                            ? "border-[#FDCE06] ring-2 ring-[#FDCE06] ring-opacity-50 shadow-lg"
                                            : "border-[#333333] hover:border-[#555555] hover:shadow-md"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent modal from opening
                                          handleImageSelect(
                                            equipment.id,
                                            index
                                          );
                                        }}
                                        title={
                                          img.caption || `Image ${index + 1}`
                                        }
                                      >
                                        <img
                                          src={img.image_url}
                                          alt={
                                            img.caption ||
                                            `Equipment view ${index + 1}`
                                          }
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                              "flex";
                                          }}
                                        />
                                        <div className="hidden w-full h-full items-center justify-center bg-[#333333]">
                                          <svg
                                            className="w-4 h-4 text-[#9CA3AF]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          <div
                            className={`space-y-2 sm:space-y-3 ${
                              equipment?.allImages.length == 1 ||
                              equipment?.allImages.length == 0
                                ? "mt-[80px]"
                                : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[#FFFFFF] text-sm font-bold lg:h-[40px] flex-1">
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
                            <p className="text-[#9CA3AF] text-xs leading-relaxed line-clamp-3 lg:h-[38.5px]">
                              {equipment.description}
                            </p>
                            <p className="text-[#FFFFFF] text-sm font-semibold">
                              {equipment.price}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRequestEquipment(equipment);
                                  console.log(
                                    equipment,
                                    requestLoading[equipment.id]
                                  );
                                }}
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
        <aside className="w-full lg:w-[389px] pb-[100px] p-4 sm:p-6 lg:p-8 lg:pt-[38px] order-first lg:order-last">
          <div className="space-y-6 lg:space-y-8 lg:flex lg:flex-col lg:justify-between h-full">
            {/* Equipment Selector */}
            <div
              className={`bg-[#1F1F20] border w-full lg:w-[378px] border-[#333333] rounded-lg p-4 sm:p-6 sm:pb-3 lg:fixed ${
                scrollTop > 150
                  ? "lg:top-[20px] right-4"
                  : "lg:top-[150px] right-4"
              } transition-all duration-300 ease-in-out`}
            >
              <div className="mb-4 sm:mb-6">
                <label className="block text-[#D1D5DB] text-sm font-medium mb-3 sm:mb-4">
                  Select Equipment
                </label>
                <div className="relative">
                  <select
                    value={selectedEquipment}
                    onChange={(e) => {
                      const newEquipment = e.target.value;
                      setSelectedEquipment(newEquipment);

                      // Update duration to minimum duration of selected equipment
                      const selectedEquipmentData = equipment.find(
                        (item) => item.equipment_name === newEquipment
                      );
                      if (selectedEquipmentData?.minimum_duration) {
                        const match =
                          selectedEquipmentData.minimum_duration.match(/(\d+)/);
                        const minMonths = match ? parseInt(match[1]) : 1;
                        setSelectedDuration(
                          `${minMonths} month${minMonths > 1 ? "s" : ""}`
                        );
                      } else {
                        // Default to 1 month if no minimum duration specified
                        setSelectedDuration("1 month");
                      }
                    }}
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

              {/* Minimum Hire Duration */}
              {/* <div className="mb-4">
                <div className="text-[#FDCE06] text-xs text-center font-semibold bg-[#1A1A1A] border border-[#333333] rounded-md py-2 px-3">
                  {(() => {
                    const selectedEquipmentData = equipment.find(
                      (item) => item.equipment_name === selectedEquipment
                    );
                    const minDuration = selectedEquipmentData?.minimum_duration;
                    return minDuration
                      ? `Minimum hire duration: ${minDuration}`
                      : "Minimum hire duration: 1 Month";
                  })()}
                </div>
              </div> */}

              {/* Hire Duration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#FFFFFF] text-base sm:text-lg font-semibold">
                    Cost of Hire
                  </span>
                  <div className="text-right">
                    <span className="text-[#FDCE06] text-base sm:text-lg font-bold">
                      {formatCurrency(finalPrice)}
                    </span>
                    <div className="text-[#9CA3AF] text-xs">
                      Total for {selectedDuration}
                    </div>
                    {equipmentDiscount > 0 && (
                      <div className="text-[#EF4444] text-sm font-semibold">
                        {formatCurrency(equipmentDiscount)} saved
                      </div>
                    )}
                  </div>
                </div>

                {/* Slider */}
                <div className="relative mb-6">
                  <input
                    type="range"
                    min={getMinimumDuration()}
                    max="12"
                    value={getSelectedDurationMonths()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setSelectedDuration(
                        `${value} month${value > 1 ? "s" : ""}`
                      );
                    }}
                    className="w-full h-3 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #0075FF 0%, #0075FF ${((getSelectedDurationMonths() - getMinimumDuration()) / (12 - getMinimumDuration())) * 100}%, #E5E5E5 ${((getSelectedDurationMonths() - getMinimumDuration()) / (12 - getMinimumDuration())) * 100}%, #E5E5E5 100%)`,
                    }}
                  />
                </div>

                {/* Month Indicators */}
                <div className="flex justify-between items-center mb-4 px-1">
                  {(() => {
                    const minDuration = getMinimumDuration();
                    const validMonths = [1, 3, 6, 9, 12].filter(
                      (month) => month >= minDuration
                    );

                    return validMonths.map((month) => {
                      const isSelected = getSelectedDurationMonths() === month;
                      const isMinimum = month === minDuration;
                      return (
                        <div
                          key={month}
                          className={`text-xs font-medium transition-all duration-300 ${
                            isSelected
                              ? "text-[#FDCE06] scale-110 font-bold"
                              : isMinimum
                                ? "text-[#FDCE06] font-semibold"
                                : "text-[#9CA3AF] hover:text-[#E5E5E5] cursor-pointer hover:scale-105"
                          }`}
                          onClick={() => {
                            requestAnimationFrame(() => {
                              setSelectedDuration(
                                `${month} month${month > 1 ? "s" : ""}`
                              );
                            });
                          }}
                          title={
                            isMinimum
                              ? `Minimum hire: ${month} month${month > 1 ? "s" : ""}`
                              : `${month} month${month > 1 ? "s" : ""}`
                          }
                        >
                          {month}
                          {isMinimum && (
                            <span className="block text-[8px] text-[#FDCE06]">
                              MIN
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Duration Display */}
                <div className="text-center">
                  <span className="text-[#FDCE06] text-lg font-bold">
                    {selectedDuration}
                  </span>
                  {equipmentDiscount > 0 && (
                    <div className="text-[#9CA3AF] text-xs mt-1">
                      {(() => {
                        const selectedEquipmentData = equipment.find(
                          (item) => item.equipment_name === selectedEquipment
                        );
                        if (
                          selectedEquipmentData?.discount_type &&
                          selectedEquipmentData?.discount_value
                        ) {
                          if (
                            selectedEquipmentData.discount_type === "percentage"
                          ) {
                            return `${selectedEquipmentData.discount_value}% package discount`;
                          } else if (
                            selectedEquipmentData.discount_type === "fixed"
                          ) {
                            return `${formatCurrency(selectedEquipmentData.discount_value)} package discount`;
                          }
                        }
                        return "";
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section (disabled in sidebar for desktop; replaced with floating popup) */}
            <div className="hidden">
              {isChatVisible ? (
                <>
                  <div className="hidden lg:block bg-[#1F1F20] border border-[#333333] rounded-lg overflow-hidden relative">
                    {/* Show Chat Button when chat is hidden */}

                    <div className="bg-[#1F1F20] border-b border-[#333333] px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[#FFFFFF] text-base font-semibold">
                          Message Rental Company
                        </h3>
                        {/* Admin status removed from client view */}
                      </div>
                      <button
                        onClick={() => setIsChatVisible(false)}
                        className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors p-1"
                        title="Hide chat"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
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
                    <div className="p-4 space-y-4 h-[400px] overflow-y-auto">
                      {/* Load More Button */}
                      {hasMoreMessages && (
                        <div className="flex justify-center mb-4">
                          <button
                            onClick={() => {
                              if (conversations.length > 0) {
                                loadMoreMessages(conversations?.[0].id);
                              }
                            }}
                            disabled={loadingMore}
                            className="bg-[#333333] text-[#E5E5E5] px-4 py-2 rounded-lg hover:bg-[#404040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            {loadingMore ? (
                              <div className="flex items-center gap-2">
                                <ClipLoader size={12} color="#E5E5E5" />
                                Loading...
                              </div>
                            ) : (
                              "Load More Messages"
                            )}
                          </button>
                        </div>
                      )}

                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-[#9CA3AF]">
                            No messages yet. Start the conversation!
                          </p>
                        </div>
                      ) : (
                        Object.entries(messageGroups).map(
                          ([date, dateMessages]) => (
                            <div key={date}>
                              {/* Date Header */}
                              <div className="flex justify-center my-4">
                                <div className="bg-[#333333] text-[#9CA3AF] text-xs px-3 py-1 rounded-full">
                                  {new Date(date).toLocaleDateString([], {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>

                              {/* Messages for this date */}
                              {dateMessages.map((message) => {
                                const messageUserId = parseInt(
                                  message.from_user_id || "0"
                                );
                                const currentUserId = getCurrentUserId();
                                const isCurrentUser =
                                  messageUserId === currentUserId &&
                                  messageUserId > 0;
                                const isEquipmentRequest =
                                  message.message_type === "equipment_request";

                                // Debug logging
                                console.log("Message alignment:", {
                                  messageId: message.id,
                                  messageUserId,
                                  currentUserId,
                                  isCurrentUser,
                                  message: message.message.substring(0, 10),
                                  rawFromUserId: message.from_user_id,
                                });

                                return (
                                  <div
                                    key={message.id}
                                    className={`flex ${
                                      isCurrentUser
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`max-w-[280px] mb-5 rounded-lg p-3 ${
                                        isEquipmentRequest
                                          ? "bg-[#FDCE06] text-[#000000] border-2 border-[#E5B800]"
                                          : isCurrentUser
                                            ? "bg-[#FDCE06] text-[#000000]"
                                            : "bg-[#292A2B] text-[#E5E5E5]"
                                      }`}
                                    >
                                      {isEquipmentRequest && (
                                        <div className="mb-2">
                                          <span className="text-xs font-bold bg-[#000000] text-[#FDCE06] px-2 py-1 rounded">
                                            Equipment Request
                                          </span>
                                        </div>
                                      )}
                                      <p className="text-sm">
                                        {message.message}
                                      </p>
                                      {message.equipment_name && (
                                        <div className="mt-2 text-xs opacity-80">
                                          Equipment: {message.equipment_name}
                                        </div>
                                      )}
                                      <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs opacity-70">
                                          {new Date(
                                            message.created_at
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                        {/* Read Receipt */}
                                        {isCurrentUser && (
                                          <div className="flex items-center gap-1">
                                            {message.read_at ? (
                                              <div className="flex items-center gap-1">
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  className="text-blue-500"
                                                >
                                                  <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  className="text-blue-500"
                                                >
                                                  <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-1">
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  className="text-gray-400"
                                                >
                                                  <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )
                        )
                      )}
                      {/* Scroll anchor for desktop chat */}
                      <div ref={messagesEndRef} />
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
                </>
              ) : (
                <div className="fixed bottom-4 right-4 lg:block hidden z-50">
                  <button
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    className="bg-[#FDCE06] hover:bg-[#E5B800] rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transition-colors"
                  >
                    <svg
                      width="20"
                      height="19"
                      viewBox="0 0 20 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.0002 8.875C20.0002 13.3633 15.5236 17 10.0002 17C8.55096 17 7.17596 16.75 5.93377 16.3008C5.46893 16.6406 4.71112 17.1055 3.81268 17.4961C2.87518 17.9023 1.74628 18.25 0.625182 18.25C0.371276 18.25 0.144713 18.0977 0.0470568 17.8633C-0.0505994 17.6289 0.00408808 17.3633 0.179869 17.1836L0.191588 17.1719C0.203307 17.1602 0.218932 17.1445 0.242369 17.1172C0.285338 17.0703 0.351744 16.9961 0.433776 16.8945C0.593932 16.6992 0.808776 16.4102 1.02753 16.0508C1.41815 15.4023 1.78924 14.5508 1.86346 13.5938C0.691588 12.2656 0.00018184 10.6367 0.00018184 8.875C0.00018184 4.38672 4.47674 0.75 10.0002 0.75C15.5236 0.75 20.0002 4.38672 20.0002 8.875Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Chat Button - Only visible on mobile/tablet */}
      {!isChatOpen && (
        <div className="fixed bottom-4 right-4 lg:hidden z-50">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-[#FDCE06] hover:bg-[#E5B800] rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transition-colors relative"
          >
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.0002 8.875C20.0002 13.3633 15.5236 17 10.0002 17C8.55096 17 7.17596 16.75 5.93377 16.3008C5.46893 16.6406 4.71112 17.1055 3.81268 17.4961C2.87518 17.9023 1.74628 18.25 0.625182 18.25C0.371276 18.25 0.144713 18.0977 0.0470568 17.8633C-0.0505994 17.6289 0.00408808 17.3633 0.179869 17.1836L0.191588 17.1719C0.203307 17.1602 0.218932 17.1445 0.242369 17.1172C0.285338 17.0703 0.351744 16.9961 0.433776 16.8945C0.593932 16.6992 0.808776 16.4102 1.02753 16.0508C1.41815 15.4023 1.78924 14.5508 1.86346 13.5938C0.691588 12.2656 0.00018184 10.6367 0.00018184 8.875C0.00018184 4.38672 4.47674 0.75 10.0002 0.75C15.5236 0.75 20.0002 4.38672 20.0002 8.875Z"
                fill="black"
              />
            </svg>

            {/* Notification Badge */}
            {unreadMessageCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-pulse">
                {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Button - Desktop */}
      {!isChatOpen && (
        <div className="hidden lg:block fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#FDCE06] hover:bg-[#E5B800] rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors relative"
            title="Open chat"
          >
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.0002 8.875C20.0002 13.3633 15.5236 17 10.0002 17C8.55096 17 7.17596 16.75 5.93377 16.3008C5.46893 16.6406 4.71112 17.1055 3.81268 17.4961C2.87518 17.9023 1.74628 18.25 0.625182 18.25C0.371276 18.25 0.144713 18.0977 0.0470568 17.8633C-0.0505994 17.6289 0.00408808 17.3633 0.179869 17.1836L0.191588 17.1719C0.203307 17.1602 0.218932 17.1445 0.242369 17.1172C0.285338 17.0703 0.351744 16.9961 0.433776 16.8945C0.593932 16.6992 0.808776 16.4102 1.02753 16.0508C1.41815 15.4023 1.78924 14.5508 1.86346 13.5938C0.691588 12.2656 0.00018184 10.6367 0.00018184 8.875C0.00018184 4.38672 4.47674 0.75 10.0002 0.75C15.5236 0.75 20.0002 4.38672 20.0002 8.875Z"
                fill="black"
              />
            </svg>

            {/* Notification Badge */}
            {unreadMessageCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Mobile Chat Popup */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F20] border-t border-[#333333] rounded-t-lg max-h-[80vh] flex flex-col">
            <div className="bg-[#1F1F20] border-b border-[#333333] px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-[#FFFFFF] text-base font-semibold">
                  Message Rental Company
                </h3>
                {/* Admin status removed from client view */}
              </div>
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
                  const messageUserId = parseInt(message.from_user_id || "0");
                  const currentUserId = getCurrentUserId();
                  const isCurrentUser =
                    messageUserId === currentUserId && messageUserId > 0;
                  const isEquipmentRequest =
                    message.message_type === "equipment_request";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isEquipmentRequest
                            ? "bg-[#FDCE06] text-[#000000] border-2 border-[#E5B800]"
                            : isCurrentUser
                              ? "bg-[#FDCE06] text-[#000000]"
                              : "bg-[#292A2B] text-[#E5E5E5]"
                        }`}
                      >
                        {isEquipmentRequest && (
                          <div className="mb-2">
                            <span className="text-xs font-bold bg-[#000000] text-[#FDCE06] px-2 py-1 rounded">
                              Equipment Request
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                        {message.equipment_name && (
                          <div className="mt-2 text-xs opacity-80">
                            Equipment: {message.equipment_name}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {message.read_at && (
                            <p className="text-xs opacity-50">✓ Read</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Scroll anchor for mobile chat */}
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

      {/* Desktop Chat Popup */}
      {isChatOpen && (
        <div className="hidden lg:block fixed bottom-4 right-4 z-50">
          <div className="bg-[#1F1F20] border border-[#333333] rounded-lg w-[380px] h-[520px] flex flex-col shadow-2xl">
            <div className="bg-[#1F1F20] border-b border-[#333333] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-[#FFFFFF] text-base font-semibold">
                  Message Rental Company
                </h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors"
                title="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
              className="p-4 space-y-4 flex-1 overflow-y-auto"
              ref={messagesContainerRef}
            >
              {hasMoreMessages && conversations.length > 0 && (
                <div className="flex justify-center mb-2">
                  <button
                    onClick={() => {
                      if (conversations.length > 0) {
                        loadMoreMessages(conversations[0].id);
                      }
                    }}
                    disabled={loadingMore}
                    className="bg-[#333333] text-[#E5E5E5] px-3 py-1 rounded-md hover:bg-[#404040] disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#9CA3AF]">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const messageUserId = parseInt(message.from_user_id || "0");
                  const currentUserId = getCurrentUserId();
                  const isCurrentUser =
                    messageUserId === currentUserId && messageUserId > 0;
                  const isEquipmentRequest =
                    message.message_type === "equipment_request";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isEquipmentRequest
                            ? "bg-[#FDCE06] text-[#000000] border-2 border-[#E5B800]"
                            : isCurrentUser
                              ? "bg-[#FDCE06] text-[#000000]"
                              : "bg-[#292A2B] text-[#E5E5E5]"
                        }`}
                      >
                        {isEquipmentRequest && (
                          <div className="mb-1">
                            <span className="text-[10px] font-bold bg-[#000000] text-[#FDCE06] px-2 py-0.5 rounded">
                              Equipment Request
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                        {message.equipment_name && (
                          <div className="mt-1 text-[10px] opacity-80">
                            Equipment: {message.equipment_name}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] opacity-70">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                          {message.read_at && (
                            <p className="text-[10px] opacity-50">✓ Read</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-[#333333] p-3">
              <div className="flex items-start bg-[#2A2A2B] border border-[#444444] rounded-lg px-3 py-2">
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
      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewEquipment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div
            className="bg-[#1F1F20] border border-[#333333] rounded-lg w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#333333]">
              <h3 className="text-[#E5E5E5] text-lg font-semibold">
                {quickViewEquipment.name}
              </h3>
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="text-[#9CA3AF] hover:text-white"
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

            {/* Image area */}
            <div className="relative bg-[#0F0F10]">
              <div className="w-full flex justify-center items-center">
                <img
                  src={
                    (quickViewEquipment.allImages &&
                      quickViewEquipment.allImages[quickViewImageIndex]
                        ?.image_url) ||
                    quickViewEquipment.image
                  }
                  alt={quickViewEquipment.name}
                  className="max-w-[250px] h-48 md:h-56 object-contain"
                  onError={(e) => {
                    e.target.src = "/images/graphview.png";
                  }}
                />
              </div>
              {quickViewEquipment.allImages &&
                quickViewEquipment.allImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      onClick={() =>
                        setQuickViewImageIndex(
                          (quickViewImageIndex -
                            1 +
                            quickViewEquipment.allImages.length) %
                            quickViewEquipment.allImages.length
                        )
                      }
                      aria-label="Previous image"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 19l-7-7 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      onClick={() =>
                        setQuickViewImageIndex(
                          (quickViewImageIndex + 1) %
                            quickViewEquipment.allImages.length
                        )
                      }
                      aria-label="Next image"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
              <p className="text-[#ADAEBC] text-sm w-full ">
                {quickViewEquipment.banner_description ||
                  quickViewEquipment.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#FFFFFF] text-base font-semibold">
                  Price
                </span>
                <span className="text-[#FDCE06] text-base font-bold">
                  {formatCurrency(quickViewEquipment.base_price || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
