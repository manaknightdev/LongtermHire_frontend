// @ts-nocheck
import React from "react";

function ContentDetailsModal({ isOpen, onClose, content }) {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F1F20] border border-[#333333] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <h2 className="text-[#E5E5E5] font-[Inter] font-bold text-xl">
            Content Details
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
                      Equipment ID
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.equipment_id || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Equipment Name
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.equipment_name || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Category
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.category_name || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Content ID
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.id || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Created Date
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.created_at
                        ? new Date(content.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Last Updated
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-2 text-[#E5E5E5]">
                      {content.updated_at
                        ? new Date(content.updated_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-lg mb-4">
                  Content Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Description
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-3 text-[#E5E5E5] min-h-[100px]">
                      {content.description || "No description available"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Banner Description
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md px-3 py-3 text-[#E5E5E5] min-h-[100px]">
                      {content.banner_description ||
                        "No banner description available"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] font-[Inter] font-medium text-sm mb-1">
                      Image
                    </label>
                    <div className="bg-[#292A2B] border border-[#333333] rounded-md p-3">
                      {content.image ? (
                        <div className="space-y-3">
                          <img
                            src={content.image}
                            alt={content.equipment_name}
                            className="w-full h-48 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "/placeholder-equipment.jpg";
                            }}
                          />
                          <div className="text-[#9CA3AF] text-sm break-all">
                            {content.image}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-[#1A1A1A] rounded-md">
                          <div className="text-center text-[#9CA3AF]">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="mx-auto mb-2"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle
                                cx="8.5"
                                cy="8.5"
                                r="1.5"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M21 15L16 10L5 21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p>No image available</p>
                          </div>
                        </div>
                      )}
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
          <button
            onClick={() => {
              // Handle edit action
              console.log("Edit content:", content);
              onClose();
            }}
            className="px-4 py-2 bg-[#FDCE06] text-[#1F1F20] rounded-md hover:bg-[#E5B800] transition-colors font-medium"
          >
            Edit Content
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentDetailsModal;
