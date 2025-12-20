"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
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
import { AdminService } from "@/services/adminService";

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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const approvalsArray = Array.isArray(raw?.approvals) 
      ? raw.approvals 
      : Array.isArray(raw) 
        ? raw 
        : raw?.data?.approvals || raw?.items?.approvals || [];

    return approvalsArray.map((x, idx) => {
      const registration = x || {};
      return {
        id: x._id || x.id || `user_${idx}`,
        contentId: x._id || x.id || `user_${idx}`,
        contentType: "user-registration",
        title: registration.companyName || `${registration.firstName || ''} ${registration.lastName || ''}`.trim() || "User Registration",
        snippet: registration.designation || "Pending user registration",
        authorName: `${registration.firstName || ''} ${registration.lastName || ''}`.trim() || "Unknown User",
        authorHandle: registration.email || "no-email",
        submittedAt: x.createdAt || x.submittedAt || new Date().toISOString(),
        tags: Array.isArray(x.themes) ? x.themes : [],
        userData: {
          email: registration.email,
          firstName: registration.firstName,
          lastName: registration.lastName,
          fullName: `${registration.firstName || ''} ${registration.lastName || ''}`.trim(),
          designation: registration.designation,
          companyName: registration.companyName,
          organizationType: registration.organizationType,
          themes: Array.isArray(x.themes) ? x.themes : [],
          daysPending: x.daysPending || 0
        },

        // keep original for potential deep-linking
        _raw: x,
      };
    });
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getPendingApprovals();
      if (res?.success && res.data) {
        const list = transform(res.data);
        setItems(list);
      } else {
        setItems([]);
        toast.error(res?.message || "Failed to load approvals");
      }
    } catch (e) {
      console.error("Approvals load error:", e);
      setItems([]);
      toast.error(e.message || "Failed to load approvals");
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
    try {
      if (item.contentType === "user-registration") {
        const userId = item.id || item.contentId;
        const res = await AdminService.approveUser(userId, {
          approvedBy: "admin",
          approvedAt: new Date().toISOString(),
        });

        if (res?.success) {
          toast.success(`User approved successfully: ${item.userData?.fullName || item.authorName}`);

          try {
            const privilegeRes = await AdminService.grantAutoApprovePrivilege(userId);
            if (privilegeRes?.success) {
              toast.success(`Auto-approve privilege granted to user`);
            }
          } catch (privilegeError) {
            console.warn("Could not grant auto-approve privilege:", privilegeError);
          }
        } else {
          setItems(prev); // rollback
          toast.error(res?.message || "User approval failed");
        }
      } else {
        const res = await AdminService.approveContent(
          item.contentType,
          item.contentId,
          {}
        );
        if (res?.success) {
          toast.success(`Approved: "${item.title}"`);
        } else {
          setItems(prev); // rollback
          toast.error(res?.message || "Approve failed");
        }
      }
    } catch (e) {
      setItems(prev); // rollback
      toast.error("Approve error — rolled back");
      console.error("Approve error:", e);
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

    try {
      let res;

      if (item.contentType === "user-registration") {
        res = await AdminService.rejectUser(item.id || item.contentId, reason);
      } else {
        res = await AdminService.rejectContent(
          item.contentType,
          item.contentId,
          { reason }
        );
      }

      if (res?.success) {
        toast.success(`Rejected: "${item.title}"`);
      } else {
        setItems(prev); // rollback
        toast.error(res?.message || "Reject failed");
      }
    } catch (e) {
      setItems(prev); // rollback
      toast.error("Reject error — rolled back");
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
                    onClick={() => toggleSort("name")}
                  >
                    User <SortIcon col="name" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("email")}
                  >
                    Email <SortIcon col="email" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("designation")}
                  >
                    Designation <SortIcon col="designation" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("company")}
                  >
                    Company <SortIcon col="company" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("organizationType")}
                  >
                    Org Type <SortIcon col="organizationType" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("submittedAt")}
                  >
                    Submitted <SortIcon col="submittedAt" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("daysPending")}
                  >
                    Days Pending <SortIcon col="daysPending" />
                  </th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-gray-600"
                    >
                      <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading user registrations…</span>
                      </div>
                    </td>
                  </tr>
                ) : currentPageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-gray-600"
                    >
                      No pending user registrations.
                    </td>
                  </tr>
                ) : (
                  currentPageItems.map((it) => (
                    
                    <tr
                      key={`${it.contentType}_${it.contentId}`}
                      className="border-t hover:bg-gray-50"
                    >
                      {/* User Column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div> 
                            <div className="font-medium text-gray-900">
                              {it.userData?.fullName || it.fullName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 text-sm">
                            {it.userData?.email || it.authorHandle}
                          </span>
                        </div>
                      </td>

                      {/* Designation Column */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">
                          {it.userData?.designation || "Not specified"}
                        </div>
                      </td>

                      {/* Company Column */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">
                          {it.userData?.companyName || "Not specified"}
                        </div>
                      </td>

                      {/* Organization Type Column */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 capitalize">
                          {it.userData?.organizationType || "unknown"}
                        </div>
                      </td>

                      {/* Submitted Date Column */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">
                          {it.submittedAt
                            ? new Date(it.submittedAt).toISOString().split("T")[0]
                            : "—"}
                        </div>
                      </td>

                      {/* Days Pending Column */}
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${it.userData?.daysPending > 7
                              ? "bg-red-100 text-red-800"
                              : it.userData?.daysPending > 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {it.userData?.daysPending || 0} days
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 rounded-md border hover:bg-gray-50 transition-colors"
                            onClick={() => handleView(it)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            className="p-2 rounded-md border hover:bg-green-50 hover:border-green-300 transition-colors"
                            onClick={() => handleApprove(it)}
                            title={it.contentType === "user-registration" ? "Approve User Registration" : "Approve Content"}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </button>

                          <button
                            className="p-2 rounded-md border hover:bg-red-50 hover:border-red-300 transition-colors"
                            onClick={() => requestReject(it)}
                            title={it.contentType === "user-registration" ? "Reject User Registration" : "Reject Content"}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
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
                className="px-3 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goPage(1)}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
                className="ml-2 rounded-md border px-2 py-2 text-sm hover:bg-gray-50 transition-colors"
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
