import api from "./api";

export const pricingApi = {
  // Get all pricing packages with pagination and search
  getPricingPackages: async (page = 1, limit = 10, searchData = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchData.packageId && { packageId: searchData.packageId }),
        ...(searchData.packageName && { packageName: searchData.packageName }),
      });

      const response = await api.get(
        `/v1/api/longtermhire/super_admin/pricing-packages?${params}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new pricing package
  addPricingPackage: async (packageData) => {
    try {
      const response = await api.post(
        "/v1/api/longtermhire/super_admin/pricing-packages",
        packageData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update pricing package
  updatePricingPackage: async (packageId, packageData) => {
    try {
      const response = await api.put(
        `/v1/api/longtermhire/super_admin/pricing-packages/${packageId}`,
        packageData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete pricing package
  deletePricingPackage: async (packageId) => {
    try {
      const response = await api.delete(
        `/v1/api/longtermhire/super_admin/pricing-packages/${packageId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
