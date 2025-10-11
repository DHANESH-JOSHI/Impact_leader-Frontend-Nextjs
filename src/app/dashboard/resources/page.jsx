"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
  FileText,
  Video,
  Headphones,
} from "lucide-react";
import ResourcesHeader from "@/components/resources/ResourcesHeader";
import ResourcesCardView from "@/components/resources/ResourcesCardView";
import ResourcesTableView from "@/components/resources/ResourcesTableView";
import AddResourceModal from "@/components/resources/AddResourceModal";
import ViewResourceModal from "@/components/resources/ViewResourceModal";
import DeleteConfirmModal from "@/components/resources/DeleteConfirmModal";
import { ResourcesService } from "@/services/resourcesService";

/* ===========================
   Utilities
=========================== */
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

/* ===========================
   Toasts (refined, English)
=========================== */
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles =
    type === "success"
      ? "bg-green-500 border-green-600 shadow-green-500/20"
      : type === "error"
      ? "bg-red-500 border-red-600 shadow-red-500/20"
      : type === "warning"
      ? "bg-yellow-500 border-yellow-600 shadow-yellow-500/20"
      : type === "resource"
      ? "bg-purple-500 border-purple-600 shadow-purple-500/20"
      : type === "download"
      ? "bg-teal-500 border-teal-600 shadow-teal-500/20"
      : "bg-blue-500 border-blue-600 shadow-blue-500/20";

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? AlertCircle
      : type === "warning"
      ? AlertTriangle
      : type === "resource"
      ? FileText
      : type === "download"
      ? Video
      : Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.96 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={`${styles} border rounded-lg shadow-2xl p-4 min-w-[340px] max-w-[460px] backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-white" />
            <p className="text-white text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/85 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, isVisible: true }]);
    setTimeout(() => hideToast(id), 4500);
  };
  const hideToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, showToast, hideToast };
};

/* ===========================
   Demo Data (fallback)
=========================== */
const initialResources = [
  {
    id: 1,
    title: "Mastering React 18: Complete Guide to Modern Development",
    description:
      "A 4-hour masterclass covering Suspense, Concurrent Rendering, Server Components, and advanced hooks with real projects.",
    type: "video",
    fileUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    fileName: "react18-masterclass.mp4",
    fileSize: 1250000000,
    duration: 14400,
    category: "Web Development",
    tags: [
      "react",
      "react18",
      "javascript",
      "frontend",
      "suspense",
      "hooks",
      "server components",
    ],
    author: "Sarah Chen",
    status: "published",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
    views: 15420,
    likes: 892,
    downloads: 2340,
    featured: true,
    quality: "4K",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
  },
  {
    id: 2,
    title: "Deep Focus: Ambient Soundscape for Productivity",
    description:
      "A 2-hour ambient soundscape combining nature textures, white noise, and subtle music for deep work.",
    type: "audio",
    fileUrl: "https://www.soundjay.com/misc/sounds-animals/bell-ringing-05.mp3",
    fileName: "deep-focus-ambient.mp3",
    fileSize: 240000000,
    duration: 7200,
    category: "Productivity Audio",
    tags: [
      "ambient",
      "focus",
      "productivity",
      "meditation",
      "white noise",
      "concentration",
    ],
    author: "Alex Rivera",
    status: "published",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    createdAt: "2024-01-18T15:30:00Z",
    updatedAt: "2024-01-18T15:30:00Z",
    views: 8750,
    likes: 1240,
    downloads: 3890,
    featured: true,
    quality: "320kbps",
    language: "Instrumental",
    genre: "Ambient/Electronic",
  },
  {
    id: 3,
    title: "Full-Stack JavaScript Bootcamp: Node.js & Express",
    description:
      "Backend fundamentals with Node, Express, MongoDB, auth, API design, testing, and deployment patterns.",
    type: "video",
    fileUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    fileName: "nodejs-express-bootcamp.mp4",
    fileSize: 2100000000,
    duration: 18000,
    category: "Backend Development",
    tags: [
      "nodejs",
      "express",
      "mongodb",
      "javascript",
      "backend",
      "api",
      "authentication",
      "testing",
    ],
    author: "Marcus Thompson",
    status: "published",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    createdAt: "2024-01-15T11:20:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
    views: 12800,
    likes: 687,
    downloads: 1950,
    featured: true,
    quality: "1080p",
    language: "English",
    subtitles: ["English", "Portuguese", "German"],
  },
  {
    id: 4,
    title: "AI-Powered Development Tools: Complete Guide",
    description:
      "An overview of Copilot, LLM coding, automated testing, and integrating AI into daily engineering workflows.",
    type: "video",
    fileUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    fileName: "ai-development-tools.mp4",
    fileSize: 850000000,
    duration: 5400,
    category: "AI & Development",
    tags: [
      "artificial intelligence",
      "github copilot",
      "ai tools",
      "automation",
      "productivity",
      "chatgpt",
    ],
    author: "Emma Rodriguez",
    status: "published",
    thumbnail:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    createdAt: "2024-01-25T14:15:00Z",
    updatedAt: "2024-01-25T14:15:00Z",
    views: 9200,
    likes: 456,
    downloads: 1120,
    featured: false,
    quality: "1080p",
    language: "English",
    subtitles: ["English", "Japanese", "Korean"],
  },
  {
    id: 5,
    title: "Binaural Beats: Learning & Memory",
    description:
      "Targeted frequencies to support learning, memory retention, and focus during study sessions.",
    type: "audio",
    fileUrl: "https://www.soundjay.com/misc/sounds-animals/bell-ringing-05.mp3",
    fileName: "binaural-learning-beats.mp3",
    fileSize: 180000000,
    duration: 3600,
    category: "Study Audio",
    tags: [
      "binaural beats",
      "learning",
      "memory",
      "study",
      "cognitive enhancement",
      "brain training",
    ],
    author: "Dr. Jennifer Park",
    status: "published",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    createdAt: "2024-01-22T10:45:00Z",
    updatedAt: "2024-01-22T10:45:00Z",
    views: 6890,
    likes: 892,
    downloads: 2670,
    featured: false,
    quality: "320kbps",
    language: "Instrumental",
    frequency: "40Hz Alpha Waves",
  },
  {
    id: 6,
    title: "Cloud Architecture Masterclass: AWS & Azure",
    description:
      "Architecture patterns across AWS/Azure, serverless, microservices, and cost optimization.",
    type: "video",
    fileUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    fileName: "cloud-architecture-masterclass.mp4",
    fileSize: 1800000000,
    duration: 16200,
    category: "Cloud Computing",
    tags: [
      "aws",
      "azure",
      "cloud architecture",
      "serverless",
      "microservices",
      "devops",
      "scalability",
    ],
    author: "David Kim",
    status: "draft",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    createdAt: "2024-01-28T16:30:00Z",
    updatedAt: "2024-01-28T16:30:00Z",
    views: 0,
    likes: 0,
    downloads: 0,
    featured: false,
    quality: "4K",
    language: "English",
    subtitles: ["English", "Chinese", "Hindi"],
  },
];

/* ===========================
   Animations
=========================== */
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

/* ===========================
   Page
=========================== */
export default function ResourcesPage() {
  const { toasts, showToast, hideToast } = useToast();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [sortBy, setSortBy] = useState("createdAt"); // createdAt | updatedAt | title | views | likes | downloads
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Debounce ref for search
  const searchDebounceRef = useRef(null);

  // Load on mount and whenever filters/sort/paging change (search debounced)
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      loadResources();
    }, 300); // 300ms debounce for smoother UX
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
        const api = result.data;
        const transformed =
          api.resources?.map((r) => ({
            id: r._id,
            title: r.title || "Untitled Resource",
            description: r.description || "No description available.",
            type: r.type || "document",
            fileUrl: r.fileUrl || r.downloadUrl || "",
            fileName: r.fileName || "file",
            fileSize: r.fileSize || 0,
            duration: r.duration || 0,
            category: r.category || "General",
            tags: Array.isArray(r.tags) ? r.tags : [],
            author: r.author?.name || r.author?.username || "Unknown",
            status: r.isPublic || r.isActive ? "published" : "draft",
            thumbnail:
              r.thumbnail ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
            createdAt: toISODate(r.createdAt),
            updatedAt: toISODate(r.updatedAt),
            views: r.views ?? 0,
            likes: r.likes ?? 0,
            downloads: r.downloads ?? 0,
            featured: !!r.featured,
            quality: r.quality || "Standard",
            language: r.language || "English",
          })) || [];

        setResources(transformed);
        setPagination((p) => ({
          ...p,
          total: api.total ?? transformed.length,
          totalPages: Math.max(
            1,
            Math.ceil((api.total ?? transformed.length) / p.limit)
          ),
        }));
        showToast(`Loaded ${transformed.length} resources`, "success");
      } else {
        setResources(initialResources);
        setPagination((p) => ({
          ...p,
          total: initialResources.length,
          totalPages: Math.ceil(initialResources.length / p.limit),
        }));
        showToast("Using demo data (API unavailable)", "warning");
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
      setResources(initialResources);
      setPagination((p) => ({
        ...p,
        total: initialResources.length,
        totalPages: Math.ceil(initialResources.length / p.limit),
      }));
      showToast("Failed to load resources — using demo data", "error");
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
      showToast("Uploading resource…", "info");

      let res;
      if (payload.type === "video" && payload.file) {
        res = await ResourcesService.uploadVideoResource(
          {
            title: payload.title,
            description: payload.description,
            category: payload.category,
            tags: payload.tags || [],
            themes: payload.themes || [],
          },
          payload.file
        );
      } else if (payload.type === "audio" && payload.file) {
        res = await ResourcesService.uploadAudioResource(
          {
            title: payload.title,
            description: payload.description,
            category: payload.category,
            tags: payload.tags || [],
            themes: payload.themes || [],
          },
          payload.file
        );
      } else if (payload.type === "image" && payload.file) {
        res = await ResourcesService.uploadImageResource(
          {
            title: payload.title,
            description: payload.description,
            category: payload.category,
            tags: payload.tags || [],
            themes: payload.themes || [],
          },
          payload.file
        );
      } else if (payload.file) {
        res = await ResourcesService.uploadDocumentResource(
          {
            title: payload.title,
            description: payload.description,
            category: payload.category,
            tags: payload.tags || [],
            themes: payload.themes || [],
          },
          payload.file
        );
      } else {
        // Metadata-only create
        res = await ResourcesService.createResource?.({
          title: payload.title,
          description: payload.description,
          category: payload.category,
          type: payload.type || "document",
          tags: payload.tags || [],
        });
      }

      if (res?.success) {
        setIsAddModalOpen(false);
        await loadResources();
        const label =
          payload.type === "video"
            ? "Video"
            : payload.type === "audio"
            ? "Audio"
            : "Document";
        showToast(
          `${label} “${payload.title}” uploaded successfully`,
          "success"
        );
      } else {
        showToast(
          `Upload failed${res?.message ? `: ${res.message}` : ""}`,
          "error"
        );
      }
    } catch (e) {
      console.error("Add resource error:", e);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
    const icon =
      resource.type === "video"
        ? "🎥"
        : resource.type === "audio"
        ? "🎧"
        : "📄";
    showToast(`${icon} Viewing “${resource.title}”`, "info");
  };

  const handleEditResource = async (updated) => {
    try {
      showToast("Updating resource…", "info");
      const res = await ResourcesService.updateResource?.(updated.id, updated);
      if (res?.success) {
        setResources((prev) =>
          prev.map((r) =>
            r.id === updated.id
              ? { ...r, ...updated, updatedAt: new Date().toISOString() }
              : r
          )
        );
        showToast("Resource updated", "success");
      } else {
        // Optimistic update if API doesn’t return success in dev
        setResources((prev) =>
          prev.map((r) =>
            r.id === updated.id
              ? { ...r, ...updated, updatedAt: new Date().toISOString() }
              : r
          )
        );
        showToast("Resource updated (local)", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Update failed", "error");
    }
  };

  const handleDeleteResource = (id) => {
    const target = resources.find((r) => r.id === id);
    setSelectedResource(target || null);
    setIsDeleteModalOpen(true);
    if (target) {
      showToast(
        `Ready to delete “${target.title}” (${humanBytes(target.fileSize)})`,
        "warning"
      );
    }
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      showToast("Deleting resource…", "info");
      const res = await ResourcesService.deleteResource?.(selectedResource.id);
      if (res?.success) {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        showToast("Resource deleted", "success");
      } else {
        // Optimistic fallback
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        showToast("Resource deleted (local)", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    showToast(
      mode === "card" ? "Switched to Card Gallery" : "Switched to Table List",
      "info"
    );
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    // The debounced loader will fire; toast only when query is substantive
    if (q.trim().length > 2) {
      const count = filteredResources.length;
      showToast(
        `Found ${count} result${count === 1 ? "" : "s"} for “${q.trim()}”`,
        "info"
      );
    }
  };

  const handleCategoryFilter = (category) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterCategory(category);
    showToast(
      category === "all" ? "Filter: All Categories" : `Filter: ${category}`,
      "info"
    );
  };

  const handleTypeFilter = (type) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterType(type);
    const label =
      type === "video"
        ? "Video"
        : type === "audio"
        ? "Audio"
        : type === "document"
        ? "Document"
        : "All Types";
    showToast(`Filter: ${label}`, "info");
  };

  const handleStatusFilter = (status) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterStatus(status);
    const label =
      status === "all"
        ? "All Status"
        : status === "published"
        ? "Published"
        : "Draft";
    showToast(`Filter: ${label}`, "info");
  };

  const handleResourceDownload = (resource) => {
    const icon =
      resource.type === "video"
        ? "🎥"
        : resource.type === "audio"
        ? "🎧"
        : "📄";
    showToast(
      `${icon} Download started: “${resource.title}” (${humanBytes(
        resource.fileSize
      )})`,
      "download"
    );
    // You can trigger actual download in the child component’s click handler.
  };

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean))),
    ],
    [resources]
  );
  const types = ["all", "video", "audio", "document"];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toasts */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <AnimatePresence>
          {toasts.map((t, i) => (
            <div key={t.id} style={{ marginBottom: i > 0 ? "12px" : 0 }}>
              <Toast
                message={t.message}
                type={t.type}
                isVisible={t.isVisible}
                onClose={() => hideToast(t.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

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
              showToast("Opening upload form", "info");
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
            showToast("Upload canceled", "info");
          }}
          onSubmit={handleAddResource}
          categories={categories.filter((c) => c !== "all")}
        />

        <ViewResourceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            showToast("Closed resource view", "info");
          }}
          resource={selectedResource}
          onEdit={handleEditResource}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedResource(null);
            showToast("Deletion canceled", "info");
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
