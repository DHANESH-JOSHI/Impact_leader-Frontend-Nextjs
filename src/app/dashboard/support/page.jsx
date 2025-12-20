"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
  Headphones,
} from "lucide-react";
import SupportHeader from "@/components/support/SupportHeader";
import SupportTableView from "@/components/support/SupportTableView";
import AddTicketModal from "@/components/support/AddTicketModal";
import ViewTicketModal from "@/components/support/ViewTicketModal";
import DeleteConfirmModal from "@/components/support/DeleteConfirmModal";
import { SupportService } from "@/services/supportService";
import toast from "react-hot-toast";

// Toast Component
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-700 shadow-lg";
      case "error":
        return "bg-red-600 border-red-700 shadow-lg";
      default:
        return "bg-gray-600 border-gray-700 shadow-lg";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={`${getToastStyles()} border rounded-lg p-4 min-w-[320px] max-w-[420px]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Custom hook for toast management - only success and error types
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    // Only allow 'success' or 'error' types
    const validType = type === "success" ? "success" : "error";
    const id = Date.now() + Math.random();
    const newToast = { id, message, type: validType, isVisible: true };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      hideToast(id);
    }, 4000);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};

// Animation variants
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

export default function SupportPage() {
  const { toasts, showToast, hideToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const result = await SupportService.getTickets({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        sortBy,
        sortOrder,
      });

      if (result.success) {
        const ticketsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformedTickets = ticketsData.map(ticket => ({
          id: ticket._id || ticket.id,
          _id: ticket._id || ticket.id,
          ticketNumber: ticket.ticketNumber || `#TK-${String(ticket._id || ticket.id).slice(-5).padStart(5, '0')}`,
          title: ticket.title || ticket.subject || 'Untitled Ticket',
          description: ticket.description || ticket.message || '',
          category: ticket.category || 'other',
          priority: ticket.priority || 'medium',
          status: ticket.status || 'open',
          requester: ticket.requester || ticket.createdBy || {
            name: 'Unknown',
            email: 'unknown@example.com'
          },
          replies: Array.isArray(ticket.replies) ? ticket.replies : [],
          createdAt: ticket.createdAt || new Date().toISOString(),
          updatedAt: ticket.updatedAt || ticket.createdAt || new Date().toISOString(),
        }));

        setTickets(transformedTickets);
        setPagination(prev => ({
          ...prev,
          total: paginationData.total || paginationData.totalTickets || transformedTickets.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || transformedTickets.length) / prev.limit),
        }));

      } else {
        setTickets([]);
        toast.error(result.message || "Failed to load tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
      toast.error(error.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [pagination.page, pagination.limit, searchQuery, filterCategory, filterStatus, filterPriority, sortBy, sortOrder]);

  // Get filter options
  const categories = [
    { value: "all", label: "All Categories" },
    ...SupportService.getSupportCategories(),
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    ...SupportService.getStatusOptions(),
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    ...SupportService.getPriorityLevels(),
  ];

  // Modal handlers
  const handleAddTicket = () => {
    setShowAddModal(true);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleDeleteTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTicket) return;

    setIsDeleting(true);
    try {
      const result = await SupportService.deleteTicket(selectedTicket.id || selectedTicket._id);

      if (result.success) {
        toast.success("Ticket deleted successfully");
      setShowDeleteModal(false);
      setSelectedTicket(null);
        await fetchTickets();
      } else {
        toast.error(result.message || "Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error(error.message || "Failed to delete ticket");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTicketSuccess = async () => {
    toast.success("Ticket created successfully");
    await fetchTickets();
  };

  // Filtered tickets based on search and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ticket.title?.toLowerCase().includes(query) ||
        ticket.description?.toLowerCase().includes(query) ||
        ticket.ticketNumber?.toLowerCase().includes(query) ||
        ticket.requester?.name?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filterCategory !== "all" && ticket.category !== filterCategory) {
      return false;
    }

    // Status filter
    if (filterStatus !== "all" && ticket.status !== filterStatus) {
      return false;
    }

    // Priority filter
    if (filterPriority !== "all" && ticket.priority !== filterPriority) {
      return false;
    }

    return true;
  });

  return (
    <motion.div
      className="min-h-screen p-8"
      style={{ backgroundColor: "#f8fafc" }}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toast notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </AnimatePresence>

      {/* Page Header */}
      <SupportHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        statuses={statuses}
        priorities={priorities}
        onAddTicket={handleAddTicket}
        totalTickets={filteredTickets.length}
      />

      {/* Loading State */}
      {loading ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
          variants={pageVariants}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "#2691ce" }}></div>
            <p className="text-sm" style={{ color: "#646464" }}>
              Loading support tickets...
            </p>
          </div>
        </motion.div>
      ) : (
        <SupportTableView
          tickets={filteredTickets}
          onViewTicket={handleViewTicket}
          onEditTicket={handleEditTicket}
          onDeleteTicket={handleDeleteTicket}
        />
      )}

      {/* Modals */}
      <AddTicketModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleTicketSuccess}
      />

      <ViewTicketModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onSuccess={handleTicketSuccess}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTicket(null);
        }}
        onConfirm={handleConfirmDelete}
        ticket={selectedTicket}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
}
