import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { equipmentApi } from "../services/equipmentApi";
import { pricingApi } from "../services/pricingApi";

const AddClientModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    userName: "",
    password: "",
    equipment: [],
    pricing: "",
  });

  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [availablePricing, setAvailablePricing] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);

  // Load equipment and pricing data when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        setDataLoading(true);
        try {
          // Load equipment
          const equipmentResponse = await equipmentApi.getEquipment();
          setAvailableEquipment(equipmentResponse.data || []);

          // Load pricing packages
          const pricingResponse = await pricingApi.getPricingPackages();
          setAvailablePricing(pricingResponse.data || []);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    loadData();
  }, [isOpen]);

  // Close equipment dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEquipmentDropdown &&
        !event.target.closest(".equipment-dropdown")
      ) {
        setShowEquipmentDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEquipmentDropdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle equipment selection
  const handleEquipmentToggle = (equipmentId) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter((id) => id !== equipmentId)
        : [...prev.equipment, equipmentId],
    }));
  };

  // Get selected equipment names for display
  const getSelectedEquipmentNames = () => {
    if (formData.equipment.length === 0) return "Select Equipment";
    if (formData.equipment.length === 1) {
      const equipment = availableEquipment.find(
        (eq) => eq.id === formData.equipment[0]
      );
      return equipment ? equipment.equipment_name : "Select Equipment";
    }
    return `${formData.equipment.length} equipment selected`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API (send all fields)
    const clientData = {
      client_name: formData.clientName,
      company_name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      username: formData.userName,
      password: formData.password,
      equipment: formData.equipment,
      pricing: formData.pricing,
    };

    try {
      await onSubmit(clientData);
      // Reset form on success
      setFormData({
        clientName: "",
        companyName: "",
        email: "",
        phone: "",
        userName: "",
        password: "",
        equipment: [],
        pricing: "",
      });
    } catch (error) {
      // Error handling is done in parent component
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      clientName: "",
      companyName: "",
      email: "",
      phone: "",
      userName: "",
      password: "",
      equipment: [],
      pricing: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Client"
      width="672px"
      height="1069px"
    >
      <form onSubmit={handleSubmit}>
        <div
          className="space-y-6"
          style={{
            width: "606px",
          }}
        >
          {/* Client Name Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Client Name
              </label>
            </div>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* Company Name Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Company Name
              </label>
            </div>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* Email Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Email
              </label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* Phone Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Phone
              </label>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* User Name Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                User Name
              </label>
            </div>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* Password Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors"
              style={{
                width: "606px",
                height: "46px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            />
          </div>

          {/* Equipment Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Equipment
              </label>
            </div>
            <div className="relative equipment-dropdown">
              <button
                type="button"
                className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 text-left outline-none hover:border-[#FDCE06] transition-colors flex items-center justify-between"
                style={{
                  width: "606px",
                  height: "46px",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "19px",
                }}
                onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
              >
                <span className="text-[#E5E5E5]">
                  {dataLoading
                    ? "Loading equipment..."
                    : getSelectedEquipmentNames()}
                </span>
                <div className="w-4 h-4 text-[#E5E5E5]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transform transition-transform ${
                      showEquipmentDropdown ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
              </button>

              {/* Equipment Dropdown */}
              {showEquipmentDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#292A2B] border border-[#333333] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {availableEquipment.length > 0 ? (
                    availableEquipment.map((equipment) => (
                      <div
                        key={equipment.id}
                        className="flex items-center px-4 py-3 hover:bg-[#333333] cursor-pointer"
                        onClick={() => handleEquipmentToggle(equipment.id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.equipment.includes(equipment.id)}
                          onChange={() => {}} // Handled by parent onClick
                          className="mr-3 w-4 h-4 text-[#FDCE06] bg-[#292A2B] border-[#333333] rounded focus:ring-[#FDCE06] focus:ring-2"
                        />
                        <div className="flex-1">
                          <div className="text-[#E5E5E5] font-medium">
                            {equipment.equipment_name}
                          </div>
                          <div className="text-[#9CA3AF] text-sm">
                            {equipment.category_name} - ${equipment.base_price}
                            /day
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[#9CA3AF]">
                      {dataLoading ? "Loading..." : "No equipment available"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Field */}
          <div
            style={{
              width: "606px",
              height: "74px",
            }}
          >
            <div
              style={{
                width: "606px",
                height: "20px",
                marginBottom: "8px",
              }}
            >
              <label
                className="text-[#9CA3AF]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                }}
              >
                Pricing
              </label>
            </div>
            <div className="relative">
              <select
                name="pricing"
                value={formData.pricing}
                onChange={handleInputChange}
                required
                className="w-full bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 outline-none focus:border-[#FDCE06] transition-colors appearance-none"
                style={{
                  width: "606px",
                  height: "46px",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "19px",
                }}
              >
                <option value="" className="text-[#E5E5E5]">
                  {dataLoading
                    ? "Loading pricing..."
                    : "Select pricing package"}
                </option>
                {availablePricing.map((pricing) => (
                  <option
                    key={pricing.id}
                    value={pricing.id}
                    className="text-[#E5E5E5]"
                  >
                    {pricing.package_name} -{" "}
                    {pricing.discount_type === 0
                      ? `${pricing.discount_value}% off`
                      : `$${pricing.discount_value} off`}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              >
                <svg
                  width="15"
                  height="9"
                  viewBox="0 0 15 9"
                  fill="none"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <path d="M7.5 9L0 0H15L7.5 9Z" fill="#E5E5E5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4"
            style={{
              width: "606px",
              height: "60px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              className="bg-[#333333] rounded-md text-[#FFFFFF] hover:bg-[#404040] transition-colors"
              style={{
                width: "102.375px",
                height: "44px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-md text-[#1F1F20] transition-colors flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#FDCE06] hover:bg-[#E5B800]"
              }`}
              style={{
                width: "135.1875px",
                height: "44px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "19px",
              }}
            >
              {loading ? (
                <>
                  <ClipLoader color="#1F1F20" size={16} />
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
