"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryCardView from "@/components/directory/DirectoryCardView";
import DirectoryTableView from "@/components/directory/DirectoryTableView";
import AddDirectoryModal from "@/components/directory/AddDirectoryModal";
import ViewDirectoryModal from "@/components/directory/ViewDirectoryModal";
import DeleteConfirmModal from "@/components/directory/DeleteConfirmModal";
import { DirectoryService } from "@/services/directoryService";

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

export default function DirectoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterOrganization, setFilterOrganization] = useState("all");
  const [filterESGCSR, setFilterESGCSR] = useState("all");
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
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const organizationTypes = useMemo(() => [
    { value: "all", label: "All Types" },
    ...DirectoryService.getOrganizationTypes(),
  ], []);

  const esgCsrOptions = useMemo(() => [
    { value: "all", label: "All" },
    { value: "esg", label: "ESG" },
    { value: "csr", label: "CSR" },
  ], []);

  useEffect(() => {
    loadEntries();
  }, [pagination.page, pagination.limit, filterType, filterOrganization, filterESGCSR, searchQuery, sortBy, sortOrder]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(filterOrganization !== "all" && { organizationType: filterOrganization }),
        ...(filterESGCSR === "esg" && { isESG: true }),
        ...(filterESGCSR === "csr" && { isCSR: true }),
      };

      const result = await DirectoryService.browseDirectory(params);

      if (result.success) {
        const entriesData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = entriesData.map((entry) => ({
          id: entry._id || entry.id,
          title: entry.title,
          description: entry.description,
          category: entry.category,
          organizationType: entry.organizationType,
          isESG: entry.isESG || false,
          isCSR: entry.isCSR || false,
          logo: entry.logo,
          contactInfo: entry.contactInfo || {},
          location: entry.location || {},
          website: entry.website,
          socialLinks: entry.socialLinks || {},
          themes: entry.themes || [],
          tags: entry.tags || [],
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          ...entry,
        }));

        setEntries(transformed);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || transformed.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || transformed.length) / pagination.limit),
        }));
      } else {
        toast.error(result.message || "Failed to load directory entries");
        setEntries([]);
      }
    } catch (error) {
      console.error("Failed to load directory entries:", error);
      toast.error(error.message || "Failed to load directory entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (entryData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(entryData).forEach((key) => {
        if (key === 'logo' && entryData[key] instanceof File) {
          formData.append('logo', entryData[key]);
        } else if (entryData[key] !== null && entryData[key] !== undefined) {
          if (typeof entryData[key] === 'object' && !(entryData[key] instanceof File)) {
            formData.append(key, JSON.stringify(entryData[key]));
          } else {
            formData.append(key, entryData[key]);
          }
        }
      });

      const result = await DirectoryService.createDirectoryEntry(formData);

      if (result.success) {
        toast.success("Directory entry created successfully");
        setIsAddModalOpen(false);
        await loadEntries();
      } else {
        toast.error(result.message || "Failed to create directory entry");
      }
    } catch (error) {
      console.error("Failed to create directory entry:", error);
      toast.error(error.message || "Failed to create directory entry");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (entryId, entryData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(entryData).forEach((key) => {
        if (key === 'logo' && entryData[key] instanceof File) {
          formData.append('logo', entryData[key]);
        } else if (entryData[key] !== null && entryData[key] !== undefined) {
          if (typeof entryData[key] === 'object' && !(entryData[key] instanceof File)) {
            formData.append(key, JSON.stringify(entryData[key]));
          } else {
            formData.append(key, entryData[key]);
          }
        }
      });

      const result = await DirectoryService.updateDirectoryEntry(entryId, formData);

      if (result.success) {
        toast.success("Directory entry updated successfully");
        setIsViewModalOpen(false);
        setSelectedEntry(null);
        await loadEntries();
      } else {
        toast.error(result.message || "Failed to update directory entry");
      }
    } catch (error) {
      console.error("Failed to update directory entry:", error);
      toast.error(error.message || "Failed to update directory entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      setDeleteLoading(true);
      const result = await DirectoryService.deleteDirectoryEntry(entryId);

      if (result.success) {
        toast.success("Directory entry deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedEntry(null);
        await loadEntries();
      } else {
        toast.error(result.message || "Failed to delete directory entry");
      }
    } catch (error) {
      console.error("Failed to delete directory entry:", error);
      toast.error(error.message || "Failed to delete directory entry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filteredEntries = useMemo(() => {
    return entries;
  }, [entries]);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={cardVariants}>
        <DirectoryHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          filterOrganization={filterOrganization}
          setFilterOrganization={setFilterOrganization}
          filterESGCSR={filterESGCSR}
          setFilterESGCSR={setFilterESGCSR}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          organizationTypes={organizationTypes}
          esgCsrOptions={esgCsrOptions}
          onAddEntry={() => setIsAddModalOpen(true)}
          totalEntries={pagination.total}
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "#2691ce" }}></div>
              <p className="text-lg" style={{ color: "#646464" }}>
                Loading directory entries...
              </p>
            </div>
          </motion.div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No directory entries found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <DirectoryCardView
            entries={filteredEntries}
            onViewEntry={handleViewEntry}
            onDeleteEntry={(entry) => {
              setSelectedEntry(entry);
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <DirectoryTableView
            entries={filteredEntries}
            onViewEntry={handleViewEntry}
            onDeleteEntry={(entry) => {
              setSelectedEntry(entry);
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

      <AddDirectoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEntry}
      />

      <ViewDirectoryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
        onUpdate={handleUpdateEntry}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEntry(null);
        }}
        onConfirm={() => {
          if (selectedEntry) {
            handleDeleteEntry(selectedEntry.id);
          }
        }}
        entry={selectedEntry}
        loading={deleteLoading}
      />
    </motion.div>
  );
}

