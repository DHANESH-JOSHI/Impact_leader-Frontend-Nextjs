"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ResourcesHeader from "@/components/resources/ResourcesHeader";
import ResourcesCardView from "@/components/resources/ResourcesCardView";
import ResourcesTableView from "@/components/resources/ResourcesTableView";
import AddResourceModal from "@/components/resources/AddResourceModal";
import ViewResourceModal from "@/components/resources/ViewResourceModal";
import DeleteConfirmModal from "@/components/resources/DeleteConfirmModal";
import { ResourcesService } from "@/services/resourcesService";

const toISODate = (d) => {
  try {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "" : dt.toISOString();
  } catch {
    return "";
  }
};
const humanBytes = (bytes = 0) => {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val >= 10 ? 0 : 1)} ${units[i]}`;
};

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.1 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.26, ease: "easeOut" },
  },
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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
  const [selectedResource, setSelectedResource] = useState(null);

const categories = useMemo(
  () => {
    const uniqueCategories = Array.from(
      new Set(
        resources
          .map((r) => r.category)
          .filter(Boolean)
          .filter(c => c !== "all" && c !== "")
      )
    );
    return uniqueCategories.length > 0 
      ? ["all", ...uniqueCategories]
      : ["all", "General", "Web Development", "Productivity", "Study", "Cloud Computing"];
  },
  [resources]
);
const modalCategories = useMemo(() => {
  return categories.filter((c) => c !== "all" && c !== "");
}, [categories]);

  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      loadResources();
    }, 300);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    filterCategory,
    filterType,
    filterStatus,
    sortBy,
    sortOrder,
    searchQuery,
  ]);

  const loadResources = async (extra = {}) => {
    setLoading(true);
    try {
      const result = await ResourcesService.getAllResources({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: filterCategory !== "all" ? filterCategory : undefined,
        type: filterType !== "all" ? filterType : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        sortBy,
        sortOrder,
        ...extra,
      });

      if (result?.success) {
        const resourcesData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = resourcesData.map((r) => {
          const authorObj = r.uploadedBy || r.author;
          let authorName = "Unknown";
          if (typeof authorObj === 'string') {
            authorName = authorObj;
          } else if (authorObj && typeof authorObj === 'object') {
            if (authorObj.name) {
              authorName = authorObj.name;
            } else if (authorObj.username) {
              authorName = authorObj.username;
            } else if (authorObj.firstName || authorObj.lastName) {
              authorName = `${authorObj.firstName || ''} ${authorObj.lastName || ''}`.trim();
            }
          }

          let tags = [];
          if (Array.isArray(r.tags)) {
            tags = r.tags;
          } else if (r.tags && typeof r.tags === 'string') {
            tags = [r.tags];
          }

          return {
            id: r._id || r.id,
            title: r.title || "Untitled Resource",
            description: r.description || "No description available.",
            type: r.type || "document",
            fileUrl: r.fileUrl || r.url || (r.file?.path ? `/uploads/${r.file.path}` : ""),
            fileName: r.fileName || r.file?.originalName || r.file?.filename || "file",
            fileSize: r.fileSize || r.file?.size || 0,
            duration: r.duration || 0,
            category: r.category || "General",
            tags: tags,
            author: authorName,
            status: r.isPublic !== false && r.isActive !== false ? "published" : "draft",
            thumbnail:
              r.thumbnail ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
            createdAt: toISODate(r.createdAt),
            updatedAt: toISODate(r.updatedAt),
            views: typeof r.views === 'number' ? r.views : 0,
            likes: Array.isArray(r.likes) ? r.likes.length : (typeof r.likes === 'number' ? r.likes : 0),
            downloads: typeof r.downloadCount === 'number' ? r.downloadCount : (typeof r.downloads === 'number' ? r.downloads : 0),
            featured: !!r.featured,
            quality: r.quality || "Standard",
            language: r.language || "English",
          };
        });

        setResources(transformed);
        setPagination((p) => ({
          ...p,
          total: paginationData.totalResources || paginationData.total || transformed.length,
          totalPages: Math.max(
            1,
            Math.ceil((paginationData.totalResources || paginationData.total || transformed.length) / p.limit)
          ),
        }));
        
      } else {
        setResources([]);
        setPagination((p) => ({
          ...p,
          total: 0,
          totalPages: 0,
        }));
        toast.error(result.message || "Failed to load resources");
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
      setResources([]);
      setPagination((p) => ({
        ...p,
        total: 0,
        totalPages: 0,
      }));
      toast.error(err.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  /* Client-side filtering (for fallback/demo & extra safety) */
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesCategory =
        filterCategory === "all" ||
        r.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesType = filterType === "all" || r.type === filterType;
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, filterCategory, filterType, filterStatus]);

  const sortedResources = useMemo(() => {
    const list = [...filteredResources];
    list.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });
    return list;
  }, [filteredResources, sortBy, sortOrder]);

  /* Handlers */
  const handleAddResource = async (payload) => {
    try {
      setLoading(true);

      const cleanPayload = {
        title: payload.title?.trim() || "Untitled Resource",
        description: payload.description?.trim() || "No description",
        category: payload.category?.trim() || "General",
        type: payload.type || "document",
        tags: payload.tags || [],
        themes: payload.themes || [],
        isPublic: payload.isPublic || false,
        featured: payload.featured || false,
      };
  
      let res;
      if (payload.file) {
        res = await ResourcesService.uploadDocumentResource(cleanPayload, payload.file);
      } else {
        res = await ResourcesService.createResource(cleanPayload);
      }
  
      if (res?.success) {
        setIsAddModalOpen(false);
        await loadResources();
        toast.success(`"${cleanPayload.title}" uploaded successfully`);
      } else {
        toast.error(`Upload failed: ${res?.message}`);
      }
    } catch (e) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedResource = async (resourceData) => {
    try {
      if (resourceData.id) {
        const res = await ResourcesService.updateResource(resourceData.id, resourceData);
        
      if (res?.success) {
          await loadResources();
          setIsEditModalOpen(false);
          setSelectedResource(null);
          toast.success("Resource updated successfully");
      } else {
          toast.error(res?.message || "Failed to update resource");
        }
      }
    } catch (e) {
      toast.error(e.message || "Update failed");
    }
  };

  const handleDeleteResource = (id) => {
    const target = resources.find((r) => r.id === id);
    setSelectedResource(target || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      const res = await ResourcesService.deleteResource?.(selectedResource.id);
      if (res?.success) {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        toast.success("Resource deleted");
      } else {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        toast.success("Resource deleted");
      }
    } catch (e) {
      toast.error("Delete failed. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
  };

  const handleCategoryFilter = (category) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterCategory(category);
  };

  const handleTypeFilter = (type) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterType(type);
  };

  const handleStatusFilter = (status) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterStatus(status);
  };

  const handleResourceDownload = (resource) => {
    // Download handled in component
  };

  const types = ["all", "video", "audio", "document"];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={cardVariants}>
          <ResourcesHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterCategory={filterCategory}
            setFilterCategory={handleCategoryFilter}
            filterType={filterType}
            setFilterType={handleTypeFilter}
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            types={types}
            onAddResource={() => {
              setIsAddModalOpen(true);
            }}
            totalResources={filteredResources.length}
          />
        </motion.div>

        {/* Content */}
        <motion.div variants={cardVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading resources…</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "card" ? (
                <ResourcesCardView
                  key="card-view"
                  resources={sortedResources}
                  onViewResource={handleViewResource}
                  onEditResource={handleEditResource}
                  onDeleteResource={handleDeleteResource}
                  onDownloadResource={handleResourceDownload}
                />
              ) : (
                <ResourcesTableView
                  key="table-view"
                  resources={sortedResources}
                  onViewResource={handleViewResource}
                  onEditResource={handleEditResource}
                  onDeleteResource={handleDeleteResource}
                  onDownloadResource={handleResourceDownload}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Modals */}
        <AddResourceModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onSubmit={handleAddResource}
          categories={modalCategories}
        />

        <AddResourceModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedResource(null);
          }}
          onSubmit={handleSaveEditedResource}
          categories={modalCategories}
          initialResource={selectedResource}
        />

        <ViewResourceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
          }}
          resource={selectedResource}
          onEdit={handleEditResource}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedResource(null);
          }}
          onConfirm={confirmDelete}
          resourceTitle={selectedResource?.title}
        />
      </div>
    </motion.div>
  );
}

/* ===========================
   Service contract (for reference)
=========================== */
// ResourcesService.getAllResources({
//   page, limit, search, category, type, status, sortBy, sortOrder
// }) => { success: true, data: { resources: [ ... ], total: 123 } }
//
// Optionals used:
// ResourcesService.createResource(payload)
// ResourcesService.updateResource(id, payload)
// ResourcesService.deleteResource(id)
// ResourcesService.uploadVideoResource(meta, file)
// ResourcesService.uploadAudioResource(meta, file)
// ResourcesService.uploadImageResource(meta, file)
// ResourcesService.uploadDocumentResource(meta, file)
