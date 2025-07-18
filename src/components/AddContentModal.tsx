import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { equipmentApi } from "../services/equipmentApi";
import {
  uploadImage,
  validateImageFile,
  getImagePreview,
  cleanupImagePreview,
  formatFileSize,
} from "../utils/uploadUtils";

const AddContentModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    equipment_id: "",
    description: "",
    bannerDescription: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);

  // Load equipment list when modal opens
  useEffect(() => {
    if (isOpen) {
      loadEquipmentList();
    }
  }, [isOpen]);

  // Clean up image preview when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (imagePreview) {
        cleanupImagePreview(imagePreview);
        setImagePreview(null);
      }
      setImageFile(null);
      setUploadError("");
      setFormData({
        equipment_id: "",
        description: "",
        bannerDescription: "",
        imageUrl: "",
      });
    }
  }, [isOpen, imagePreview]);

  // Load equipment list
  const loadEquipmentList = async () => {
    try {
      setEquipmentLoading(true);
      const response = await equipmentApi.getEquipment(1, 100); // Get first 100 equipment
      if (!response.error) {
        setEquipmentList(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load equipment list:", error);
    } finally {
      setEquipmentLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setUploadError("");

    if (!file) {
      setImageFile(null);
      if (imagePreview) {
        cleanupImagePreview(imagePreview);
        setImagePreview(null);
      }
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    try {
      validateImageFile(file);
      setImageFile(file);

      // Create preview
      const preview = getImagePreview(file);
      if (imagePreview) {
        cleanupImagePreview(imagePreview);
      }
      setImagePreview(preview);

      // Upload image immediately
      setUploadLoading(true);
      const uploadResult = await uploadImage(file);

      // Update form data with uploaded image URL
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadResult.url,
      }));
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadError(error.message);
      setImageFile(null);
      if (imagePreview) {
        cleanupImagePreview(imagePreview);
        setImagePreview(null);
      }
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find selected equipment details
    const selectedEquipment = equipmentList.find(
      (eq) => eq.id.toString() === formData.equipment_id
    );

    // Prepare data for API
    const contentData = {
      equipment_id: formData.equipment_id,
      equipment_name: selectedEquipment?.equipment_name || "",
      description: formData.description,
      banner_description: formData.bannerDescription,
      image_url: formData.imageUrl,
    };

    try {
      await onSubmit(contentData);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      cleanupImagePreview(imagePreview);
      setImagePreview(null);
    }
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setUploadError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Content"
      width="672px"
      height="700px"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6" style={{ width: "606px" }}>
          {/* Equipment ID will be auto-generated */}

          {/* Equipment Selection */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Select Equipment*
            </label>
            {equipmentLoading ? (
              <div className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] flex items-center justify-center">
                <ClipLoader size={20} color="#FDCE06" />
                <span className="ml-2 text-[#9CA3AF] text-sm">
                  Loading equipment...
                </span>
              </div>
            ) : (
              <select
                name="equipment_id"
                value={formData.equipment_id}
                onChange={handleInputChange}
                required
                className="w-full h-[48px] bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors"
              >
                <option value="">Select an equipment...</option>
                {equipmentList.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.equipment_name} (ID:{" "}
                    {equipment.equipment_id || equipment.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Equipment Image
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-[#333333] rounded-[8px] p-6 text-center hover:border-[#FDCE06] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadLoading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-[#9CA3AF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span className="text-[#E5E5E5] font-[Inter] font-medium text-[14px]">
                    {uploadLoading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <span className="text-[#9CA3AF] font-[Inter] font-normal text-[12px] mt-1">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
                {uploadLoading && (
                  <div className="mt-3">
                    <ClipLoader color="#FDCE06" size={20} />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-[8px] border border-[#333333]"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {imageFile && (
                  <div className="mt-2 text-[#9CA3AF] font-[Inter] font-normal text-[12px]">
                    {imageFile.name} ({formatFileSize(imageFile.size)})
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className="mt-2 text-red-400 font-[Inter] font-normal text-[12px]">
                {uploadError}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 py-3 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors resize-none"
              placeholder="Enter equipment description"
            />
          </div>

          {/* Banner Description */}
          <div>
            <label className="block text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Banner Description
            </label>
            <textarea
              name="bannerDescription"
              value={formData.bannerDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[8px] px-4 py-3 text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] focus:outline-none focus:border-[#FDCE06] transition-colors resize-none"
              placeholder="Enter banner description"
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
              disabled={loading || uploadLoading}
              className="flex-1 h-[48px] bg-[#FDCE06] rounded-[8px] text-[#1A1A1A] font-[Inter] font-medium text-[14px] leading-[1.21em] hover:bg-[#E5B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader color="#1A1A1A" size={20} />
              ) : (
                "Add Content"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddContentModal;
