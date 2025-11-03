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

// Dummy data for localStorage
const dummySupportTickets = [
  {
    id: "1",
    _id: "1",
    ticketNumber: "#TK-00001",
    title: "Unable to login to my account",
    description: "I've been trying to login for the past 2 hours but keep getting 'Invalid credentials' error even though I'm sure my password is correct. Please help urgently.",
    category: "account",
    priority: "high",
    status: "open",
    requester: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
    },
    replies: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    _id: "2",
    ticketNumber: "#TK-00002",
    title: "Feature request: Dark mode",
    description: "It would be great if the application had a dark mode option. Working late at night becomes difficult with the current bright interface.",
    category: "feature-request",
    priority: "low",
    status: "in-progress",
    requester: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
    },
    replies: [
      {
        id: "r1",
        message: "Thank you for your suggestion! We have added this to our roadmap and will consider it for the next release.",
        author: {
          name: "Support Team",
          role: "support",
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    _id: "3",
    ticketNumber: "#TK-00003",
    title: "Payment gateway integration issue",
    description: "The payment gateway is not working on the checkout page. Customers are reporting errors when trying to complete purchases. This is affecting our business.",
    category: "technical",
    priority: "urgent",
    status: "in-progress",
    requester: {
      name: "Amit Patel",
      email: "amit.patel@example.com",
    },
    replies: [
      {
        id: "r2",
        message: "We are investigating this issue with high priority. Our technical team has been notified.",
        author: {
          name: "Admin",
          role: "support",
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    _id: "4",
    ticketNumber: "#TK-00004",
    title: "How to export reports in PDF format?",
    description: "I need to export monthly reports in PDF format but cannot find the option. Could you please guide me on how to do this?",
    category: "general-inquiry",
    priority: "medium",
    status: "resolved",
    requester: {
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
    },
    replies: [
      {
        id: "r3",
        message: "To export reports in PDF format, go to Reports > Monthly Reports > Click on the export icon at top right > Select PDF format.",
        author: {
          name: "Support Team",
          role: "support",
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "r4",
        message: "Thank you! That worked perfectly.",
        author: {
          name: "Sneha Reddy",
          role: "user",
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    _id: "5",
    ticketNumber: "#TK-00005",
    title: "Billing discrepancy in invoice",
    description: "My invoice shows incorrect charges for this month. I was charged $299 but my plan is $199. Please check and refund the difference.",
    category: "account",
    priority: "high",
    status: "waiting",
    requester: {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
    },
    replies: [
      {
        id: "r5",
        message: "We have reviewed your account and need some additional information. Could you please share your subscription plan details?",
        author: {
          name: "Billing Team",
          role: "support",
        },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    _id: "6",
    ticketNumber: "#TK-00006",
    title: "API documentation is outdated",
    description: "The API documentation on the website shows old endpoints that are no longer working. Please update the docs with current API version.",
    category: "bug-report",
    priority: "medium",
    status: "open",
    requester: {
      name: "Deepak Joshi",
      email: "deepak.joshi@example.com",
    },
    replies: [],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    _id: "7",
    ticketNumber: "#TK-00007",
    title: "Training session request",
    description: "We would like to schedule a training session for our team of 10 people on how to use the advanced features of the platform.",
    category: "training",
    priority: "low",
    status: "closed",
    requester: {
      name: "Meera Kapoor",
      email: "meera.kapoor@example.com",
    },
    replies: [
      {
        id: "r6",
        message: "Thank you for your interest. We have scheduled a training session for next week. You will receive a calendar invite shortly.",
        author: {
          name: "Training Team",
          role: "support",
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "r7",
        message: "Training completed successfully. Closing this ticket.",
        author: {
          name: "Admin",
          role: "support",
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    _id: "8",
    ticketNumber: "#TK-00008",
    title: "Data privacy concern",
    description: "I want to understand what data you collect and how it's being used. Also, how can I request deletion of my personal data?",
    category: "data-privacy",
    priority: "medium",
    status: "open",
    requester: {
      name: "Ananya Gupta",
      email: "ananya.gupta@example.com",
    },
    replies: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

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

  // Initialize localStorage with dummy data if not exists
  const initializeLocalStorage = () => {
    if (typeof window !== "undefined") {
      const existingData = localStorage.getItem("supportTickets");
      if (!existingData) {
        localStorage.setItem("supportTickets", JSON.stringify(dummySupportTickets));
      }
    }
  };

  // Fetch tickets from localStorage
  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get tickets from localStorage
      const storedTickets = localStorage.getItem("supportTickets");
      const allTickets = storedTickets ? JSON.parse(storedTickets) : dummySupportTickets;

      setTickets(allTickets);
      setPagination({
        ...pagination,
        total: allTickets.length,
        totalPages: Math.ceil(allTickets.length / pagination.limit),
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showToast("Error fetching tickets", "error");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize localStorage on mount
  useEffect(() => {
    initializeLocalStorage();
    fetchTickets();
  }, []);

  // Fetch tickets when filters change
  useEffect(() => {
    if (tickets.length > 0) {
      // No need to fetch again, just filter on client side
    }
  }, [
    searchQuery,
    filterCategory,
    filterStatus,
    filterPriority,
    sortBy,
    sortOrder,
  ]);

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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Delete from localStorage
      const storedTickets = localStorage.getItem("supportTickets");
      const allTickets = storedTickets ? JSON.parse(storedTickets) : [];
      const updatedTickets = allTickets.filter(
        (ticket) => ticket.id !== selectedTicket.id && ticket._id !== selectedTicket._id
      );
      localStorage.setItem("supportTickets", JSON.stringify(updatedTickets));

      showToast("Ticket deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showToast("Error deleting ticket", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTicketSuccess = () => {
    showToast("Ticket saved successfully", "success");
    fetchTickets();
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
