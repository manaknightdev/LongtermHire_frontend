import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";

const EditClientModal = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
  });

  // Update form data when client prop changes
  useEffect(() => {
    if (client) {
      setFormData({
        clientName: client.client_name || "",
        companyName: client.company_name || "",
        email: client.email || "",
        phone: client.phone || "",
      });
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation - only allow digits
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API
    const clientData = {
      client_name: formData.clientName,
      company_name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      await onSubmit(clientData);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form to original client data
    if (client) {
      setFormData({
        clientName: client.client_name || "",
        companyName: client.company_name || "",
        email: client.email || "",
        phone: client.phone || "",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Client"
      width="672px"
      height="600px"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6" style={{ width: "606px" }}>
          {/* Client Name */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Client Name*
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              required
              className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors"
              placeholder="Enter client name"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Company Name*
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors"
              placeholder="Enter company name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Phone
            </label>
            <input
              type="text"
              inputMode="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-[48px] bg-transparent border border-[#333333] rounded-[8px] text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] hover:border-[#555555] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-[48px] bg-[#FDCE06] rounded-[8px] text-[#1A1A1A] font-[Inter] font-medium text-[14px] leading-[1.21em] hover:bg-[#E5B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader color="#1A1A1A" size={20} />
              ) : (
                "Update Client"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditClientModal;
