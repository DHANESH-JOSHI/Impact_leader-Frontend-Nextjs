"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
  Eye,
  Pencil,
  Trash2,
  Plus,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check,
  XCircle,
  FileText,
  MessageSquare,
  Image,
  BookOpen,
  Tag,
  User,
  Clock,
} from "lucide-react";
// Services
import { AdminService } from "@/services/adminService";
/* ===========================
   Toasts
=========================== */
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [isVisible, onClose]);
  if (!isVisible) return null;

  const styles =
    type === "success"
      ? "bg-green-500 border-green-600 shadow-green-500/20"
      : type === "error"
      ? "bg-red-500 border-red-600 shadow-red-500/20"
      : type === "warning"
      ? "bg-yellow-500 border-yellow-600 shadow-yellow-500/20"
      : type === "info"
      ? "bg-blue-500 border-blue-600 shadow-blue-500/20"
      : "bg-gray-500 border-gray-600 shadow-gray-500/20";

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? AlertCircle
      : type === "warning"
      ? AlertTriangle
      : Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed top-4 right-4 z-[100]"
    >
      <div
        className={`${styles} border rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[420px]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-white" />
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
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
    setTimeout(() => hideToast(id), 4000);
  };
  const hideToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, showToast, hideToast };
};

/* ===========================
   Demo Fallback
=========================== */
const demoApprovals = [
  {
    contentId: "p_101",
    contentType: "post",
    title: "Why Rust in Prod",
    snippet: "Borrow checker tames foot-guns…",
    authorName: "Alexandra Chen",
    authorHandle: "alexchen",
    submittedAt: "2025-08-23T10:22:00Z",
    tags: ["engineering", "rust"],
  },
  {
    contentId: "r_55",
    contentType: "resource",
    title: "Design Tokens Starter",
    snippet: "A Figma → code pipeline",
    authorName: "Marcus Rodriguez",
    authorHandle: "marcus",
    submittedAt: "2025-08-22T14:11:00Z",
    tags: ["design", "tokens"],
  },
  {
    contentId: "q_77",
    contentType: "qna",
    title: "How to debounce in React?",
    snippet: "Should I use lodash or custom…",
    authorName: "Sarah Kim",
    authorHandle: "sarahk",
    submittedAt: "2025-08-21T08:05:00Z",
    tags: ["react", "frontend"],
  },
  {
    contentId: "s_19",
    contentType: "story",
    title: "From Monolith to Services",
    snippet: "We split the beast in 4 weeks…",
    authorName: "David Thompson",
    authorHandle: "davidth",
    submittedAt: "2025-08-20T06:30:00Z",
    tags: ["architecture", "migration"],
  },
];

/* ===========================
   Animations
=========================== */
const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

/* ===========================
   Modals
=========================== */
const ModalWrapper = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ViewItemModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;
  const Icon =
    item.contentType === "post"
      ? FileText
      : item.contentType === "resource"
      ? BookOpen
      : item.contentType === "qna"
      ? MessageSquare
      : Image; // story or other

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Submission Details">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <div className="text-lg font-semibold">{item.title}</div>
            <div className="text-gray-600 text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="capitalize">{item.contentType}</span>
              <span>•</span>
              <User className="h-4 w-4" />
              <span>
                {item.authorName}{" "}
                <span className="text-gray-500">@{item.authorHandle}</span>
              </span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{item.submittedAt?.split("T")[0]}</span>
            </div>
          </div>
        </div>
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="rounded-md border p-3 bg-gray-50">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {item.snippet || "No preview available."}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

const RejectModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Reject “${title}”`}>
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Provide a reason for rejection (shared with the submitter).
        </p>
        <textarea
          className="w-full min-h-[120px] rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 text-sm"
          placeholder="Reason (policy violation, low quality, duplicates, etc.)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* ===========================
   Approvals Page
=========================== */
export default function ApprovalsPage() {
  const { toasts, showToast, hideToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters / sort / pagination (client-side for now)
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // post | resource | qna | story | all
  const [sortBy, setSortBy] = useState("submittedAt"); // submittedAt | title | author | type
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const transform = (raw) => {
    // Normalize unknown API shapes safely
    // Expecting array at response.data; if it’s an object with list + total, we’ll adapt
    const arr = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
    return arr.map((x, idx) => ({
      id: x.id || x._id || x.contentId || `tmp_${idx}`,
      contentId: x.contentId || x.id || x._id || `tmp_${idx}`,
      contentType:
        (x.contentType || x.type || "").toString().toLowerCase() || "post",
      title: x.title || x.name || "(Untitled)",
      snippet: x.snippet || x.preview || x.excerpt || "",
      authorName:
        x.authorName ||
        x.author?.name ||
        `${x.author?.firstName || ""} ${x.author?.lastName || ""}`.trim() ||
        "Unknown",
      authorHandle:
        x.authorHandle || x.author?.username || x.author?.handle || "unknown",
      submittedAt: x.submittedAt || x.createdAt || new Date().toISOString(), // fallback
      tags: x.tags || [],
      // keep original for potential deep-linking
      _raw: x,
    }));
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getPendingApprovals();
      if (res?.success) {
        const list = transform(res.data);
        setItems(list);
        showToast(`Loaded ${list.length} pending approvals`, "success");
      } else {
        setItems(transform(demoApprovals));
        showToast("Using demo approvals (API unavailable)", "warning");
      }
    } catch (e) {
      console.error("Approvals load error:", e);
      setItems(transform(demoApprovals));
      showToast("Failed to load approvals — using demo", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived data
  const filtered = useMemo(() => {
    let data = [...items];

    // type filter
    if (typeFilter !== "all") {
      data = data.filter((i) => i.contentType === typeFilter);
    }

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((i) => {
        return (
          i.title.toLowerCase().includes(q) ||
          i.authorName.toLowerCase().includes(q) ||
          i.authorHandle.toLowerCase().includes(q) ||
          i.contentType.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // sort
    data.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case "title":
          va = a.title.toLowerCase();
          vb = b.title.toLowerCase();
          break;
        case "author":
          va = a.authorName.toLowerCase();
          vb = b.authorName.toLowerCase();
          break;
        case "type":
          va = a.contentType.toLowerCase();
          vb = b.contentType.toLowerCase();
          break;
        case "submittedAt":
        default:
          va = new Date(a.submittedAt).getTime();
          vb = new Date(b.submittedAt).getTime();
      }
      if (va < vb) return sortOrder === "asc" ? -1 : 1;
      if (va > vb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [items, searchQuery, typeFilter, sortBy, sortOrder]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
  const page = Math.min(pagination.page, totalPages);
  const startIdx = (page - 1) * pagination.limit;
  const currentPageItems = filtered.slice(
    startIdx,
    startIdx + pagination.limit
  );

  // handlers
  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const goPage = (dir) => {
    setPagination((p) => {
      const next = Math.min(totalPages, Math.max(1, p.page + dir));
      return { ...p, page: next };
    });
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleApprove = async (item) => {
    // optimistic remove from list
    const prev = items;
    setItems((cur) => cur.filter((x) => x.contentId !== item.contentId));
    showToast("Approving…", "info");

    try {
      const res = await AdminService.approveContent(
        item.contentType,
        item.contentId,
        {} // approvalData (e.g., notes) can be added here
      );
      if (res?.success) {
        showToast(`Approved: “${item.title}”`, "success");
      } else {
        setItems(prev); // rollback
        showToast(res?.message || "Approve failed", "error");
      }
    } catch (e) {
      setItems(prev); // rollback
      showToast("Approve error — rolled back", "error");
    }
  };

  const [rejectTarget, setRejectTarget] = useState(null);
  const requestReject = (item) => {
    setRejectTarget(item);
    setIsRejectModalOpen(true);
  };

  const confirmReject = async (reason) => {
    const item = rejectTarget;
    if (!item) return;
    setIsRejectModalOpen(false);

    const prev = items;
    setItems((cur) => cur.filter((x) => x.contentId !== item.contentId));
    showToast("Rejecting…", "info");

    try {
      const res = await AdminService.rejectContent(
        item.contentType,
        item.contentId,
        { reason }
      );
      if (res?.success) {
        showToast(`Rejected: “${item.title}”`, "success");
      } else {
        setItems(prev); // rollback
        showToast(res?.message || "Reject failed", "error");
      }
    } catch (e) {
      setItems(prev); // rollback
      showToast("Reject error — rolled back", "error");
    } finally {
      setRejectTarget(null);
    }
  };

  /* ===========================
     UI
  =========================== */
  const SortIcon = ({ col }) =>
    sortBy === col ? (
      sortOrder === "asc" ? (
        <ChevronUp className="h-4 w-4 inline" />
      ) : (
        <ChevronDown className="h-4 w-4 inline" />
      )
    ) : null;

  const TypeIcon = ({ type }) => {
    const t = (type || "").toLowerCase();
    const map = {
      post: FileText,
      resource: BookOpen,
      qna: MessageSquare,
      story: Image,
    };
    const Icon = map[t] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const typeOptions = ["all", "post", "resource", "qna", "story"];

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
            <div key={t.id} style={{ marginBottom: i > 0 ? 8 : 0 }}>
              <Toast {...t} onClose={() => hideToast(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Controls */}
        <motion.div
          variants={cardVariants}
          className="bg-white border rounded-xl p-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Pending Approvals</h1>
              <span className="text-sm text-gray-600">({total} total)</span>
            </div>
            <div className="flex flex-1 items-center gap-2 md:justify-end">
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  className="w-full rounded-lg border pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search title, author, tags…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border px-3 py-2 text-sm"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  title="Filter by type"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t === "all"
                        ? "All Types"
                        : t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="hidden md:flex items-center gap-1 text-gray-600">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("type")}
                  >
                    Type <SortIcon col="type" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("title")}
                  >
                    Title <SortIcon col="title" />
                  </th>
                  <th className="text-left px-4 py-3">Author</th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("submittedAt")}
                  >
                    Submitted <SortIcon col="submittedAt" />
                  </th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-gray-600"
                    >
                      <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading approvals…</span>
                      </div>
                    </td>
                  </tr>
                ) : currentPageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-gray-600"
                    >
                      Nothing pending. Serene silence—the best SLA.
                    </td>
                  </tr>
                ) : (
                  currentPageItems.map((it) => (
                    <tr
                      key={`${it.contentType}_${it.contentId}`}
                      className="border-t"
                    >
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2 capitalize">
                          <TypeIcon type={it.contentType} />
                          {it.contentType}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{it.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {it.snippet || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{it.authorName}</span>
                          <span className="text-gray-500">
                            @{it.authorHandle}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {it.submittedAt
                          ? new Date(it.submittedAt).toISOString().split("T")[0]
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 rounded-md border hover:bg-gray-50"
                            onClick={() => handleView(it)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded-md border hover:bg-green-50 hover:border-green-300"
                            onClick={() => handleApprove(it)}
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded-md border hover:bg-red-50 hover:border-red-300"
                            onClick={() => requestReject(it)}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
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
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goPage(-1)}
                disabled={page <= 1}
                className="px-3 py-2 rounded-md border disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goPage(1)}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-md border disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <select
                value={pagination.limit}
                onChange={(e) =>
                  setPagination((p) => ({
                    ...p,
                    page: 1,
                    limit: Number(e.target.value),
                  }))
                }
                className="ml-2 rounded-md border px-2 py-2 text-sm"
                title="Rows per page"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ViewItemModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        item={selectedItem}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectTarget(null);
        }}
        onConfirm={confirmReject}
        title={rejectTarget?.title || ""}
      />
    </motion.div>
  );
}
