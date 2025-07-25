// @ts-nocheck
import React from "react";

function ClientDetailsModal({
  isOpen,
  onClose,
  client,
  clientEquipment = [],
  clientPricing = [],
}) {
  console.log("Modal - Equipment:", clientEquipment);
  console.log("Modal - Pricing:", clientPricing);

  // Debug individual equipment items
  if (clientEquipment && clientEquipment.length > 0) {
    clientEquipment.forEach((eq, index) => {
      console.log(`Equipment ${index}:`, eq);
      console.log(`Equipment ${index} name:`, eq.equipment_name);
      console.log(`Equipment ${index} category:`, eq.category_name);
    });
  }

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F1F20] border border-[#333333] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <h2 className="text-[#E5E5E5] font-[Inter] font-bold text-xl">
            Client Details
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#E5E5E5] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-lg mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Client ID
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.id || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Client Name
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.client_name || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Company Name
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.company_name || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Email
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.email || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Phone
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.phone || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      User ID
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.user_id || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Created Date
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.created_at
                        ? new Date(client.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Last Updated
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {client.updated_at
                        ? new Date(client.updated_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Equipment & Pricing */}
            <div className="space-y-6">
              {/* Assigned Equipment */}
              {/* <div>
                <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-lg mb-4">
                  Assigned Equipment
                </h3>
                <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-3 text-[#E5E5E5] min-h-[120px]">
                  {clientEquipment && clientEquipment.length > 0 ? (
                    <div className="space-y-2">
                      {clientEquipment.map((equipment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1 border-b border-[#333333] last:border-b-0"
                        >
                          <span>
                            {equipment.equipment_name ||
                              equipment.name ||
                              "Unknown Equipment"}
                          </span>
                          <span className="text-[#9CA3AF] text-sm">
                            {equipment.category_name ||
                              equipment.category ||
                              "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[#9CA3AF] text-center py-8">
                      No equipment assigned
                    </div>
                  )}
                </div>
              </div> */}

              {/* Pricing Package */}
              <div>
                <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-lg mb-4">
                  Pricing Package
                </h3>
                <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-3 text-[#E5E5E5] min-h-[100px]">
                  {clientPricing && clientPricing.length > 0 ? (
                    <div className="space-y-2">
                      {clientPricing.map((pricing, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1 border-b border-[#333333] last:border-b-0"
                        >
                          <span>
                            {pricing.package_name ||
                              pricing.name ||
                              "Unknown Package"}
                          </span>
                          <span className="text-[#FDCE06] text-sm">
                            {pricing.description || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[#9CA3AF] text-center py-8">
                      No pricing package assigned
                    </div>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-lg mb-4">
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Status
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === "active"
                            ? "bg-green-100 text-green-800"
                            : client.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {client.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#333333]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#292A2B] border border-[#333333] text-[#E5E5E5] rounded-md hover:bg-[#333333] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsModal;
