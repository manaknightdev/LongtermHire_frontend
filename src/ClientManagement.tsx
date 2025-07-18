import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddClientModal from "./components/AddClientModal";
import EditClientModal from "./components/EditClientModal";
import EquipmentPopover from "./components/EquipmentPopover";
import PricingPopover from "./components/PricingPopover";
import CustomPackageModal from "./components/CustomPackageModal";
import { clientApi } from "./services/clientApi";
import { equipmentApi } from "./services/equipmentApi";
import { pricingApi } from "./services/pricingApi";

const ClientManagement = () => {
  const [searchData, setSearchData] = useState({
    clientId: "",
    clientName: "",
    companyName: "",
  });

  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Equipment popover state
  const [equipmentPopover, setEquipmentPopover] = useState({
    isOpen: false,
    clientId: null,
    anchorEl: null,
  });

  // Pricing popover state
  const [pricingPopover, setPricingPopover] = useState({
    isOpen: false,
    clientId: null,
    anchorEl: null,
  });
  const [customPackageModal, setCustomPackageModal] = useState({
    isOpen: false,
    clientId: null,
  });

  // API data states
  const [clients, setClients] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [pricingPackages, setPricingPackages] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (page = 1, searchFilters = {}) => {
    try {
      setLoading(true);
      const [clientsRes, equipmentRes, pricingRes] = await Promise.all([
        clientApi.getClients(page, 10, searchFilters),
        equipmentApi.getEquipment(),
        pricingApi.getPricingPackages(),
      ]);

      const clientsData = clientsRes.data || [];
      setClients(clientsData);
      setEquipment(equipmentRes.data || []);
      setPricingPackages(pricingRes.data || []);

      // Update pagination info
      if (clientsRes.pagination) {
        setPagination(clientsRes.pagination);
        setCurrentPage(clientsRes.pagination.page);
      }

      // Load assignments for each client
      await loadClientAssignments(clientsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load equipment and pricing assignments for all clients
  const loadClientAssignments = async (clientsData) => {
    try {
      const equipmentAssignments = {};

      for (const client of clientsData) {
        try {
          // Load equipment assignments
          const equipmentRes = await clientApi.getClientEquipment(
            client.user_id
          );
          if (equipmentRes.data && equipmentRes.data.length > 0) {
            equipmentAssignments[client.user_id] = equipmentRes.data.map(
              (item) => item.equipment_id
            );
          }
        } catch (error) {
          console.error(
            `Error loading assignments for client ${client.user_id}:`,
            error
          );
          // Continue with other clients even if one fails
        }
      }

      setClientEquipment(equipmentAssignments);
    } catch (error) {
      console.error("Error loading client assignments:", error);
    }
  };

  const handleInviteClient = async (clientData) => {
    try {
      setInviteLoading(true);
      await clientApi.inviteClient(clientData);
      toast.success("Client invited successfully! Invitation email sent.");
      setIsAddClientModalOpen(false);
      loadInitialData(); // Reload clients
    } catch (error) {
      console.error("Error inviting client:", error);
      toast.error(error.message || "Error inviting client. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientApi.deleteClient(clientId);
        toast.success("Client deleted successfully!");
        loadInitialData(currentPage, searchData); // Reload current page
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error(
          error.message || "Error deleting client. Please try again."
        );
      }
    }
  };

  const handleAssignEquipment = async (clientUserId, equipmentIds) => {
    try {
      setAssignmentLoading(true);
      await clientApi.assignEquipment(clientUserId, equipmentIds);
      toast.success("Equipment assigned successfully!");
      // Don't reload entire page, just update silently
    } catch (error) {
      console.error("Error assigning equipment:", error);
      toast.error(
        error.message || "Error assigning equipment. Please try again."
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleAssignPricing = async (
    clientUserId,
    pricingPackageId,
    customDiscount = null
  ) => {
    try {
      setAssignmentLoading(true);
      await clientApi.assignPricing(
        clientUserId,
        pricingPackageId,
        customDiscount
      );
      toast.success("Pricing package assigned successfully!");
      // Don't reload entire page, just update silently
    } catch (error) {
      console.error("Error assigning pricing:", error);
      toast.error(
        error.message || "Error assigning pricing. Please try again."
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Get all available equipment options from API data
  const getAllEquipmentOptions = () => {
    return equipment.map((item) => ({
      id: item.id,
      name: item.equipment_name,
      category: item.category_name,
      available: item.availability,
    }));
  };

  // Track selected equipment per client
  const [clientEquipment, setClientEquipment] = useState({});

  // Helper function to get assigned equipment names
  const getAssignedEquipmentNames = (clientUserId) => {
    const assignedIds = clientEquipment[clientUserId] || [];
    return assignedIds
      .map((id) => {
        const equipmentItem = equipment.find((eq) => eq.id === id);
        return equipmentItem
          ? String(equipmentItem.equipment_name)
          : `Equipment ${id}`;
      })
      .filter(Boolean); // Remove any undefined/null values
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Search data:", searchData);
    setCurrentPage(1); // Reset to first page when searching
    loadInitialData(1, searchData);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadInitialData(newPage, searchData);
  };

  const handleAddClient = () => {
    setIsAddClientModalOpen(true);
  };

  // Edit client handlers
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsEditClientModalOpen(true);
  };

  const handleUpdateClient = async (clientData) => {
    try {
      setInviteLoading(true);
      await clientApi.updateClient(selectedClient.id, clientData);
      toast.success("Client updated successfully!");
      setIsEditClientModalOpen(false);
      setSelectedClient(null);
      loadInitialData(currentPage, searchData); // Reload current page
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error updating client. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  // Equipment assignment handlers
  const handleEquipmentAssign = (clientUserId, event) => {
    setEquipmentPopover({
      isOpen: true,
      clientId: clientUserId,
      anchorEl: event.currentTarget,
    });
  };

  const handleEquipmentApply = async (selectedEquipmentIds) => {
    if (equipmentPopover.clientId) {
      try {
        await handleAssignEquipment(
          equipmentPopover.clientId,
          selectedEquipmentIds
        );
        // Update local state for UI
        setClientEquipment((prev) => ({
          ...prev,
          [equipmentPopover.clientId]: selectedEquipmentIds,
        }));
      } catch (error) {
        console.error("Error applying equipment assignment:", error);
      }
    }
    setEquipmentPopover({ isOpen: false, clientId: null, anchorEl: null });
  };

  // Pricing assignment handlers
  const handlePricingClick = (clientUserId, event) => {
    setPricingPopover({
      isOpen: true,
      clientId: clientUserId,
      anchorEl: event.currentTarget,
    });
  };

  const handleCustomPackageClick = () => {
    // Close popover and open custom modal
    setCustomPackageModal({
      isOpen: true,
      clientId: pricingPopover.clientId,
    });
    setPricingPopover({ isOpen: false, clientId: null, anchorEl: null });
  };

  const handleCustomPackageSave = async (customPackage) => {
    if (customPackageModal.clientId) {
      try {
        await handleAssignPricing(
          customPackageModal.clientId,
          `custom_${Date.now()}`,
          customPackage
        );
        toast.success("Custom discount assigned successfully!");
        // Reload data to reflect changes
        loadInitialData(currentPage, searchData);
      } catch (error) {
        console.error("Error applying custom pricing:", error);
        toast.error("Error applying custom discount. Please try again.");
      }
    }
    // Close custom modal
    setCustomPackageModal({ isOpen: false, clientId: null });
  };

  const handlePricingSelect = async (
    selectedPackageId,
    customDiscount = null
  ) => {
    if (pricingPopover.clientId) {
      try {
        await handleAssignPricing(
          pricingPopover.clientId,
          selectedPackageId,
          customDiscount
        );
        // Reload data to reflect changes
        loadInitialData(currentPage, searchData);
      } catch (error) {
        console.error("Error applying pricing assignment:", error);
      }
    }
    // Always close the popover
    setPricingPopover({ isOpen: false, clientId: null, anchorEl: null });
  };

  // Removed static clientData - now using API data from 'clients' state

  // Show loading spinner while data is loading
  if (loading) {
    return (
      <div className="p-8 bg-[#292A2B] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClipLoader color="#FDCE06" size={50} />
          <p className="text-[#E5E5E5] mt-4">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#292A2B] min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[#E5E5E5] font-[Inter] font-bold text-[36px] leading-[1.11em]">
          Client Management
        </h1>
      </header>

      {/* Search Section */}
      <section className="bg-[#1F1F20] border border-[#333333] rounded-lg p-6 mb-8">
        <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-[20px] leading-[1.2em] mb-6">
          Search
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Client ID Field */}
          <div className="flex flex-col">
            <label className="text-[#9CA3AF] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Client ID
            </label>
            <input
              type="text"
              name="clientId"
              value={searchData.clientId}
              onChange={handleInputChange}
              className="bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 py-3 outline-none focus:border-[#FDCE06] transition-colors"
              style={{ height: "42px" }}
            />
          </div>

          {/* Client Name Field */}
          <div className="flex flex-col">
            <label className="text-[#9CA3AF] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={searchData.clientName}
              onChange={handleInputChange}
              className="bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 py-3 outline-none focus:border-[#FDCE06] transition-colors"
              style={{ height: "42px" }}
            />
          </div>

          {/* Company Name Field */}
          <div className="flex flex-col">
            <label className="text-[#9CA3AF] font-[Inter] font-medium text-[14px] leading-[1.21em] mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={searchData.companyName}
              onChange={handleInputChange}
              className="bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] px-4 py-3 outline-none focus:border-[#FDCE06] transition-colors"
              style={{ height: "42px" }}
            />
          </div>

          {/* Search Button */}
          <div className="flex flex-col">
            <button
              onClick={handleSearch}
              className="bg-[#FDCE06] rounded-md text-[#1F1F20] font-[Inter] font-bold text-[16px] leading-[1.19em] px-6 py-3 hover:bg-[#E5B800] transition-colors"
              style={{ height: "42px" }}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Client Table Section */}
      <section className="bg-[#1F1F20] border border-[#333333] rounded-lg">
        {/* Section Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#333333]">
          <h3 className="text-[#E5E5E5] font-[Inter] font-semibold text-[20px] leading-[1.4em]">
            Client
          </h3>
          <button
            onClick={handleAddClient}
            className="bg-[#FDCE06] rounded-md text-[#1F1F20] font-[Inter] font-bold text-[16px] leading-[1.19em] px-6 py-2 hover:bg-[#E5B800] transition-colors"
          >
            + Add Client
          </button>
        </div>

        {/* Table Container with Overflow */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            {/* Table Header */}
            <thead className="bg-[#292A2B]">
              <tr>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-left px-4 py-3 w-16">
                  ID#
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-left px-4 py-3 min-w-[160px]">
                  Client Name*
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-left px-4 py-3 min-w-[180px]">
                  Email
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-left px-4 py-3 min-w-[120px]">
                  Phone
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-center px-4 py-3 min-w-[120px]">
                  Equipment
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-center px-4 py-3 min-w-[140px]">
                  Pricing
                </th>
                <th className="text-[#9CA3AF] font-[Inter] font-bold text-[12px] leading-[1.25em] text-center px-4 py-3 min-w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-[#9CA3AF] py-8">
                    No clients found. Click "Add Client" to invite your first
                    client.
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={`${
                      index < clients.length - 1
                        ? "border-b border-[#333333]"
                        : ""
                    } hover:bg-[#292A2B] transition-colors`}
                  >
                    <td className="text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] px-4 py-4">
                      {client.id}
                    </td>
                    <td className="text-[#E5E5E5] font-[Inter] font-medium text-[14px] leading-[1.21em] px-4 py-4">
                      {client.client_name}
                    </td>
                    <td className="text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] px-4 py-4">
                      {client.email}
                    </td>
                    <td className="text-[#E5E5E5] font-[Inter] font-normal text-[14px] leading-[1.21em] px-4 py-4">
                      {client.phone || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) =>
                            handleEquipmentAssign(client.user_id, e)
                          }
                          title={
                            clientEquipment[client.user_id]?.length > 0
                              ? `Assigned Equipment: ${
                                  getAssignedEquipmentNames(
                                    client.user_id
                                  ).join(", ") || "Loading..."
                                }`
                              : "Click to assign equipment"
                          }
                          className={`border rounded-md font-[Inter] font-normal text-[12px] leading-[1.25em] px-3 py-1 flex items-center gap-2 transition-colors ${
                            clientEquipment[client.user_id]?.length > 0
                              ? "bg-[#FDCE06] border-[#FDCE06] text-[#1F1F20]"
                              : "bg-[#292A2B] border-[#333333] text-[#E5E5E5] hover:border-[#FDCE06]"
                          }`}
                        >
                          {clientEquipment[client.user_id]?.length > 0
                            ? `Assigned (${
                                clientEquipment[client.user_id].length
                              })`
                            : "Assign"}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M0.748047 3.74823L10.5036 9.74935L0.748047 3.74823Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => handlePricingClick(client.user_id, e)}
                          className={`border rounded-md font-[Inter] font-normal text-[12px] leading-[1.25em] px-3 py-1 flex items-center gap-2 transition-colors ${
                            client.pricing_package_name ||
                            client.custom_discount_value
                              ? "bg-[#FDCE06] border-[#FDCE06] text-[#1F1F20]"
                              : "bg-[#292A2B] border-[#333333] text-[#E5E5E5] hover:border-[#FDCE06]"
                          }`}
                        >
                          {client.pricing_package_name
                            ? client.pricing_package_name
                            : client.custom_discount_value
                            ? `Custom ${client.custom_discount_value}${
                                client.custom_discount_type === "percentage"
                                  ? "%"
                                  : "$"
                              } off`
                            : "Set Pricing"}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M0.748047 3.74823L10.5036 9.74935L0.748047 3.74823Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 items-center justify-center">
                        <button className="text-[#FDCE06] font-[Inter] font-medium text-[14px] leading-[1.43em] hover:underline transition-all">
                          Details
                        </button>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-[#FDCE06] font-[Inter] font-medium text-[14px] leading-[1.43em] hover:underline transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-400 font-[Inter] font-medium text-[14px] leading-[1.43em] hover:underline transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center p-6 border-t border-[#333333]">
            <div className="text-[#9CA3AF] font-[Inter] font-normal text-[14px]">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} clients
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] font-[Inter] font-medium text-[14px] hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum =
                    Math.max(
                      1,
                      Math.min(pagination.totalPages - 4, pagination.page - 2)
                    ) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 border rounded-md font-[Inter] font-medium text-[14px] transition-colors ${
                        pageNum === pagination.page
                          ? "bg-[#FDCE06] border-[#FDCE06] text-[#1A1A1A]"
                          : "bg-[#292A2B] border-[#333333] text-[#E5E5E5] hover:bg-[#333333]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] font-[Inter] font-medium text-[14px] hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSubmit={handleInviteClient}
        loading={inviteLoading}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditClientModalOpen}
        onClose={() => {
          setIsEditClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleUpdateClient}
        client={selectedClient}
        loading={inviteLoading}
      />

      {/* Equipment Popover */}
      <EquipmentPopover
        isOpen={equipmentPopover.isOpen}
        onClose={() =>
          setEquipmentPopover({ isOpen: false, clientId: null, anchorEl: null })
        }
        onApply={handleEquipmentApply}
        referenceElement={equipmentPopover.anchorEl}
        selectedEquipment={
          equipmentPopover.clientId
            ? clientEquipment[equipmentPopover.clientId] || []
            : []
        }
        equipmentOptions={getAllEquipmentOptions()}
        loading={assignmentLoading}
      />

      {/* Pricing Popover */}
      <PricingPopover
        isOpen={pricingPopover.isOpen}
        onClose={() =>
          setPricingPopover({ isOpen: false, clientId: null, anchorEl: null })
        }
        onSelect={handlePricingSelect}
        onCustomPackageClick={handleCustomPackageClick}
        referenceElement={pricingPopover.anchorEl}
        equipmentOptions={getAllEquipmentOptions()}
        pricingPackages={pricingPackages}
        loading={assignmentLoading}
      />

      {/* Custom Package Modal */}
      <CustomPackageModal
        isOpen={customPackageModal.isOpen}
        onClose={() => setCustomPackageModal({ isOpen: false, clientId: null })}
        onSave={handleCustomPackageSave}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default ClientManagement;
