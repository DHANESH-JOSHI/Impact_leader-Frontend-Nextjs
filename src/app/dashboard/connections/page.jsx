"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ConnectionsHeader from "@/components/connections/ConnectionsHeader";
import ConnectionsCardView from "@/components/connections/ConnectionsCardView";
import ConnectionsTableView from "@/components/connections/ConnectionsTableView";
import AddConnectionModal from "@/components/connections/AddConnectionModal";
import ViewConnectionModal from "@/components/connections/ViewConnectionModal";
import DeleteConfirmModal from "@/components/connections/DeleteConfirmModal";
import { ConnectionsService } from "@/services/connectionsService";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const statuses = useMemo(() => [
    { value: "all", label: "All Status" },
    ...ConnectionsService.getConnectionStatuses(),
  ], []);

  const types = useMemo(() => [
    { value: "all", label: "All Types" },
    ...ConnectionsService.getConnectionTypes(),
  ], []);

  useEffect(() => {
    loadConnections();
  }, [pagination.page, pagination.limit, filterStatus, filterType, searchQuery, sortBy, sortOrder]);

  const loadConnections = async (params = {}) => {
    setLoading(true);
    try {
      const result = await ConnectionsService.getMyConnections({
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus !== "all" ? filterStatus : "accepted",
        search: searchQuery || undefined,
        ...params,
      });

      if (result.success) {
        const connectionsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = connectionsData.map((conn) => {
          const user = conn.user || conn.requester || conn.recipient || {};
          const userName = user.name || user.firstName || user.username || user.email || "Unknown User";

          return {
            id: conn._id || conn.id,
            user: user,
            name: userName,
            email: user.email || "",
            company: user.company || user.organization || "",
            type: conn.connectionType || conn.type || "professional",
            status: conn.status || "pending",
            message: conn.message || "",
            createdAt: conn.createdAt,
            updatedAt: conn.updatedAt,
            mutualConnections: conn.mutualConnections || 0,
          };
        });

        let filtered = transformed;
        if (filterType !== "all") {
          filtered = filtered.filter((conn) => conn.type === filterType);
        }

        setConnections(filtered);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || filtered.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || filtered.length) / prev.limit),
        }));
      } else {
        setConnections([]);
        toast.error(result.message || "Failed to load connections");
      }
    } catch (error) {
      console.error("Failed to load connections:", error);
      setConnections([]);
      toast.error(error.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = useMemo(() => {
    let filtered = [...connections];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conn) => {
        const name = conn.name.toLowerCase();
        const email = conn.email.toLowerCase();
        const company = conn.company.toLowerCase();
        return name.includes(query) || email.includes(query) || company.includes(query);
      });
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [connections, searchQuery, sortBy, sortOrder]);

  const handleAddConnection = async (connectionData) => {
    try {
      setLoading(true);
      const result = await ConnectionsService.sendConnectionRequest(connectionData);

      if (result.success) {
        toast.success("Connection request sent successfully");
        setIsAddModalOpen(false);
        await loadConnections();
      } else {
        toast.error(result.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Failed to send connection request:", error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    try {
      setLoading(true);
      const result = await ConnectionsService.acceptConnectionRequest(connectionId);

      if (result.success) {
        toast.success("Connection accepted successfully");
        await loadConnections();
      } else {
        toast.error(result.message || "Failed to accept connection");
      }
    } catch (error) {
      console.error("Failed to accept connection:", error);
      toast.error(error.message || "Failed to accept connection");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConnection = async (connectionId) => {
    try {
      setLoading(true);
      const result = await ConnectionsService.rejectConnectionRequest(connectionId);

      if (result.success) {
        toast.success("Connection request rejected");
        await loadConnections();
      } else {
        toast.error(result.message || "Failed to reject connection");
      }
    } catch (error) {
      console.error("Failed to reject connection:", error);
      toast.error(error.message || "Failed to reject connection");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (connectionId) => {
    try {
      setLoading(true);
      const result = await ConnectionsService.removeConnection(connectionId);

      if (result.success) {
        toast.success("Connection removed successfully");
        setIsDeleteModalOpen(false);
        setSelectedConnection(null);
        await loadConnections();
      } else {
        toast.error(result.message || "Failed to remove connection");
      }
    } catch (error) {
      console.error("Failed to remove connection:", error);
      toast.error(error.message || "Failed to remove connection");
    } finally {
      setLoading(false);
    }
  };

  const handleViewConnection = (connection) => {
    setSelectedConnection(connection);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={cardVariants}>
        <ConnectionsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          statuses={statuses}
          types={types}
          onAddConnection={() => setIsAddModalOpen(true)}
          totalConnections={pagination.total}
        />
      </motion.div>

      <motion.div className="mb-6" variants={cardVariants}>
        {loading ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-lg" style={{ color: "#646464" }}>
                Loading connections...
              </p>
            </div>
          </motion.div>
        ) : filteredConnections.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No connections found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <ConnectionsCardView
            connections={filteredConnections}
            onViewConnection={handleViewConnection}
            onDeleteConnection={(id) => {
              const conn = filteredConnections.find((c) => c.id === id);
              setSelectedConnection(conn);
              setIsDeleteModalOpen(true);
            }}
            onAcceptConnection={handleAcceptConnection}
            onRejectConnection={handleRejectConnection}
          />
        ) : (
          <ConnectionsTableView
            connections={filteredConnections}
            onViewConnection={handleViewConnection}
            onDeleteConnection={(id) => {
              const conn = filteredConnections.find((c) => c.id === id);
              setSelectedConnection(conn);
              setIsDeleteModalOpen(true);
            }}
            onAcceptConnection={handleAcceptConnection}
            onRejectConnection={handleRejectConnection}
          />
        )}
      </motion.div>

      {pagination.totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center space-x-2 mt-6"
          variants={cardVariants}
        >
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Previous
          </button>
          <span className="px-4 py-2" style={{ color: "#646464" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Next
          </button>
        </motion.div>
      )}

      <AddConnectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddConnection}
        connectionTypes={ConnectionsService.getConnectionTypes()}
      />

      <ViewConnectionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedConnection(null);
        }}
        connection={selectedConnection}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedConnection(null);
        }}
        onConfirm={() => {
          if (selectedConnection) {
            handleDeleteConnection(selectedConnection.id);
          }
        }}
        connectionName={selectedConnection?.name}
      />
    </motion.div>
  );
}

