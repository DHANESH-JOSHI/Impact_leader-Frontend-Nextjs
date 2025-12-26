"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryCardView from "@/components/directory/DirectoryCardView";
import DirectoryTableView from "@/components/directory/DirectoryTableView";
import AddDirectoryModal from "@/components/directory/AddDirectoryModal";
import ViewDirectoryModal from "@/components/directory/ViewDirectoryModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
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
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterOrganization, setFilterOrganization] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
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
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const organizationTypes = useMemo(() => [
    { value: "all", label: "All Types" },
    ...DirectoryService.getOrganizationTypes(),
  ], []);

  const [themes, setThemes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadEntries();
  }, [pagination.page, pagination.limit, filterCategory, filterOrganization, filterTheme, filterLocation, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    loadThemes();
    loadCategories();
  }, []);

  const loadThemes = async () => {
    try {
      // Get unique themes from directory entries
      const result = await DirectoryService.browseDirectory({ limit: 1000 });
      if (result.success && Array.isArray(result.data)) {
        const allThemes = new Set();
        result.data.forEach(entry => {
          if (Array.isArray(entry.themes)) {
            entry.themes.forEach(theme => {
              if (theme) allThemes.add(theme);
            });
          }
        });
        setThemes(Array.from(allThemes).sort().map(theme => ({ value: theme, label: theme })));
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await DirectoryService.getCategories();
      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data.map(cat => ({ value: cat, label: cat })));
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      // Map frontend sort to backend sortBy/sortOrder
      let backendSortBy = sortBy;
      let backendSortOrder = sortOrder;
      
      if (sortBy === "newest") {
        backendSortBy = "createdAt";
        backendSortOrder = "desc";
      } else if (sortBy === "oldest") {
        backendSortBy = "createdAt";
        backendSortOrder = "asc";
      } else if (sortBy === "name") {
        backendSortBy = "title";
        backendSortOrder = "asc";
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: backendSortBy,
        sortOrder: backendSortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(filterOrganization !== "all" && { organizationType: filterOrganization }),
        ...(filterCategory !== "all" && { category: filterCategory }),
        ...(filterTheme !== "all" && { themes: filterTheme }),
        ...(filterLocation && { location: filterLocation }),
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
          logo: entry.logo,
          contactInfo: entry.contactInfo || {},
          location: entry.location || {},
          website: entry.website,
          socialLinks: entry.socialLinks || {},
          // Normalize themes: extract names from theme objects or use strings directly
          themes: Array.isArray(entry.themes) 
            ? entry.themes.map(theme => {
                if (typeof theme === 'string') return theme; // Already a name
                if (theme && typeof theme === 'object') return theme.name || theme; // Extract name from object
                return theme; // Fallback
              }).filter(Boolean)
            : [],
          tags: entry.tags || [],
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          ...entry,
        }));

        setEntries(transformed);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.totalEntries || paginationData.total || transformed.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalEntries || paginationData.total || transformed.length) / pagination.limit),
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

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(false); // Close view modal
    setIsEditModalOpen(true); // Open edit modal
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
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterOrganization={filterOrganization}
          setFilterOrganization={setFilterOrganization}
          filterTheme={filterTheme}
          setFilterTheme={setFilterTheme}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          organizationTypes={organizationTypes}
          categories={categories}
          themes={themes}
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
            onEditEntry={handleEditEntry}
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
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={handleAddEntry}
      />

      <AddDirectoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={(entryData) => {
          if (selectedEntry?.id) {
            handleUpdateEntry(selectedEntry.id, entryData);
          }
        }}
        initialDirectory={selectedEntry}
      />

      <ViewDirectoryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
        onUpdate={handleUpdateEntry}
        onEdit={handleEditEntry}
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
        title="Delete Directory Entry"
        message="Are you sure you want to delete this directory entry? This action cannot be undone."
        itemName={selectedEntry?.title}
        isLoading={deleteLoading}
      />
    </motion.div>
  );
}

