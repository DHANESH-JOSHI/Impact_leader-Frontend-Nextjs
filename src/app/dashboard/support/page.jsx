"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
} from "lucide-react";
import SupportHeader from "@/components/support/SupportHeader";
import SupportTableView from "@/components/support/SupportTableView";
import AddTicketModal from "@/components/support/AddTicketModal";
import ViewTicketModal from "@/components/support/ViewTicketModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
import { SupportService } from "@/services/supportService";
import toast from "react-hot-toast";

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


  return (
    <motion.div
      className="min-h-screen p-8"
      style={{ backgroundColor: "#f8fafc" }}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >

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
        totalTickets={pagination.total}
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
          tickets={tickets}
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
        title="Delete Support Ticket"
        message="Are you sure you want to delete this support ticket? This action cannot be undone."
        itemName={selectedTicket ? `Ticket #${selectedTicket.ticketId} - ${selectedTicket.subject}` : undefined}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
