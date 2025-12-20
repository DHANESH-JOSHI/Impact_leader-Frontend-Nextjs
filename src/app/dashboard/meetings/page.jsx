"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import MeetingsHeader from "@/components/meetings/MeetingsHeader";
import MeetingsCardView from "@/components/meetings/MeetingsCardView";
import MeetingsTableView from "@/components/meetings/MeetingsTableView";
import AddMeetingModal from "@/components/meetings/AddMeetingModal";
import ViewMeetingModal from "@/components/meetings/ViewMeetingModal";
import DeleteConfirmModal from "@/components/meetings/DeleteConfirmModal";
import { MeetingsService } from "@/services/meetingsService";

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

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const statuses = useMemo(() => [
    { value: "all", label: "All Status" },
    ...MeetingsService.getMeetingStatuses(),
  ], []);

  const types = useMemo(() => [
    { value: "all", label: "All Types" },
    ...MeetingsService.getMeetingTypes(),
  ], []);

  useEffect(() => {
    loadMeetings();
  }, [pagination.page, pagination.limit, filterStatus, filterType, searchQuery, sortBy, sortOrder]);

  const loadMeetings = async (params = {}) => {
    setLoading(true);
    try {
      const result = await MeetingsService.getAllMeetings({
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus !== "all" ? filterStatus : undefined,
        meetingType: filterType !== "all" ? filterType : undefined,
        search: searchQuery || undefined,
        ...params,
      });

      if (result.success) {
        const meetingsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = meetingsData.map((meeting) => {
          const organizer = meeting.organizer || meeting.organizerEmail || "Unknown";
          const attendees = Array.isArray(meeting.attendees) ? meeting.attendees : [];

          return {
            id: meeting._id || meeting.id,
            title: meeting.title || "Untitled Meeting",
            description: meeting.description || "",
            startTime: meeting.startTime || meeting.startDate,
            endTime: meeting.endTime || meeting.endDate,
            meetingType: meeting.meetingType || "google-meet",
            timezone: meeting.timezone || "Asia/Kolkata",
            status: meeting.status || "scheduled",
            organizer: typeof organizer === "string" ? organizer : organizer.email || organizer.name || "Unknown",
            attendees: attendees,
            attendeeCount: attendees.length,
            meetingLink: meeting.meetingLink || meeting.link || "",
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
          };
        });

        setMeetings(transformed);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || transformed.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || transformed.length) / prev.limit),
        }));
      } else {
        setMeetings([]);
        toast.error(result.message || "Failed to load meetings");
      }
    } catch (error) {
      console.error("Failed to load meetings:", error);
      setMeetings([]);
      toast.error(error.message || "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = useMemo(() => {
    let filtered = [...meetings];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((meeting) => {
        const title = meeting.title.toLowerCase();
        const description = meeting.description.toLowerCase();
        const organizer = meeting.organizer.toLowerCase();
        return title.includes(query) || description.includes(query) || organizer.includes(query);
      });
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        if (aVal instanceof Date) {
          aVal = aVal.getTime();
          bVal = bVal.getTime();
        } else if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [meetings, searchQuery, sortBy, sortOrder]);

  const handleAddMeeting = async (meetingData) => {
    try {
      setLoading(true);
      const result = await MeetingsService.startMeetingCreation(meetingData);

      if (result.success) {
        toast.success("Meeting created successfully");
        setIsAddModalOpen(false);
        await loadMeetings();
      } else {
        toast.error(result.message || "Failed to create meeting");
      }
    } catch (error) {
      console.error("Failed to create meeting:", error);
      toast.error(error.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setIsEditModalOpen(true);
  };

  const handleUpdateMeeting = async (meetingData) => {
    try {
      setLoading(true);
      const result = await MeetingsService.startMeetingCreation({
        ...meetingData,
        id: selectedMeeting?.id,
      });

      if (result.success) {
        toast.success("Meeting updated successfully");
        setIsEditModalOpen(false);
        setSelectedMeeting(null);
        await loadMeetings();
      } else {
        toast.error(result.message || "Failed to update meeting");
      }
    } catch (error) {
      console.error("Failed to update meeting:", error);
      toast.error(error.message || "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      setLoading(true);
      toast.error("Delete functionality needs to be implemented in the service");
      setIsDeleteModalOpen(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      toast.error(error.message || "Failed to delete meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
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
        <MeetingsHeader
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
          onAddMeeting={() => setIsAddModalOpen(true)}
          totalMeetings={pagination.total}
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
                Loading meetings...
              </p>
            </div>
          </motion.div>
        ) : filteredMeetings.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No meetings found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <MeetingsCardView
            meetings={filteredMeetings}
            onViewMeeting={handleViewMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={(id) => {
              const meeting = filteredMeetings.find((m) => m.id === id);
              setSelectedMeeting(meeting);
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <MeetingsTableView
            meetings={filteredMeetings}
            onViewMeeting={handleViewMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={(id) => {
              const meeting = filteredMeetings.find((m) => m.id === id);
              setSelectedMeeting(meeting);
              setIsDeleteModalOpen(true);
            }}
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

      <AddMeetingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMeeting}
        meetingTypes={MeetingsService.getMeetingTypes()}
      />

      <AddMeetingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMeeting(null);
        }}
        onSubmit={handleUpdateMeeting}
        meetingTypes={MeetingsService.getMeetingTypes()}
        initialMeeting={selectedMeeting}
      />

      <ViewMeetingModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMeeting(null);
        }}
        onConfirm={() => {
          if (selectedMeeting) {
            handleDeleteMeeting(selectedMeeting.id);
          }
        }}
        meetingTitle={selectedMeeting?.title}
      />
    </motion.div>
  );
}

