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
} from "lucide-react";
import { UsersService } from "@/services/usersService";
import { PostsService } from "@/services/postsService";
import { ResourcesService } from "@/services/resourcesService";
import { QnAService } from "@/services/qnaService";
import { StoriesService } from "@/services/storiesService";
import { NotificationsService } from "@/services/notificationsService";
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
   Mock Data (fallback)
=========================== */
const initialUsers = [
  {
    id: "u_1",
    name: "Alexandra Chen",
    username: "alexchen",
    email: "alexandra.chen@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-05",
    lastActive: "2025-08-20",
    posts: 42,
    followers: 1203,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "u_2",
    name: "Marcus Rodriguez",
    username: "marcus",
    email: "marcus.rod@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-02-18",
    lastActive: "2025-08-23",
    posts: 31,
    followers: 890,
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "u_3",
    name: "Sarah Kim",
    username: "sarahk",
    email: "sarah.kim@example.com",
    role: "author",
    status: "suspended",
    createdAt: "2024-03-02",
    lastActive: "2025-07-30",
    posts: 18,
    followers: 501,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "u_4",
    name: "David Thompson",
    username: "davidth",
    email: "david.t@example.com",
    role: "viewer",
    status: "invited",
    createdAt: "2024-05-11",
    lastActive: null,
    posts: 0,
    followers: 12,
    avatar: "https://i.pravatar.cc/100?img=7",
  },
];

/* ===========================
   Page Animations
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
   Modals (inline, self-contained)
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

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "viewer",
    status: "invited",
  });
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

const ViewUserModal = ({ isOpen, onClose, user, onEdit }) => {
  if (!user) return null;
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Directory Details">
      <div className="flex gap-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="space-y-1">
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">@{user.username}</div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="h-4 w-4" /> {user.email}
          </div>
          {/* <div className="flex items-center gap-2 text-sm text-gray-700">
            <Shield className="h-4 w-4" /> Role:{" "}
            <span className="font-medium">{user.role}</span>
          </div> */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4" /> Joined: {user.createdAt}
          </div>
          <div className="text-sm text-gray-700">
            Last Active: {user.lastActive || "—"}
          </div>
          {/* <div className="text-sm text-gray-700">
            Posts: {user.posts} · Followers: {user.followers}
          </div> */}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() =>
            onEdit({
              ...user,
              role: user.role === "viewer" ? "author" : "viewer",
            })
          }
          className="px-4 py-2 rounded-md border flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" /> Quick Toggle Role
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, targetName }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
    <p className="text-sm text-gray-700">
      You are about to delete{" "}
      <span className="font-semibold">{targetName}</span>. This action cannot be
      undone.
    </p>
    <div className="flex justify-end gap-3 mt-6">
      <button onClick={onClose} className="px-4 py-2 rounded-md border">
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  </ModalWrapper>
);

/* ===========================
   Users Page
=========================== */
export default function UsersPage() {
  const { toasts, showToast, hideToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters / sort / pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("createdAt"); // createdAt | name | role | status | lastActive | posts | followers
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    roleFilter,
    statusFilter,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await UsersService.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy,
        sortOrder,
      });

      if (result?.success) {
        const api = result.data;

        const transformed = (api || []).map((u) => ({
          id: u.id,
          name:
            u.name ||
            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
            "Unnamed",
          username: u.firstName || u.handle || "unknown",
          email: u.email || "no-email",
          role: u.role || "viewer",
          status:
            u.status ||
            (u.isActive ? "active" : u.invited ? "invited" : "suspended"),
          createdAt: u.createdAt
            ? new Date(u.createdAt).toISOString().split("T")[0]
            : "",
          lastActive: u.lastActiveAt
            ? new Date(u.lastActiveAt).toISOString().split("T")[0]
            : null,
          posts: u.stats?.posts || 0,
          followers: u.stats?.followers || 0,
          avatar: u.avatar || `https://i.pravatar.cc/100?u=${u._id}`,
        }));
        setUsers(transformed);
        setPagination((p) => ({
          ...p,
          total: api.total || transformed.length,
          totalPages: Math.max(
            1,
            Math.ceil((api.total || transformed.length) / p.limit)
          ),
        }));
        showToast(`Loaded ${transformed.length} users`, "success");
      } else {
        setUsers(initialUsers);
        setPagination((p) => ({
          ...p,
          total: initialUsers.length,
          totalPages: Math.ceil(initialUsers.length / p.limit),
        }));
        showToast("Using demo directory (API unavailable)", "warning");
      }
    } catch (e) {
      console.error("Users load error:", e);
      setUsers(initialUsers);
      showToast("Failed to load users — using demo directory", "error");
    } finally {
      setLoading(false);
    }
  };

  // derived data
  const roles = useMemo(
    () => ["all", ...Array.from(new Set(users.map((u) => u.role)))],
    [users]
  );

  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(users.map((u) => u.status)))],
    [users]
  );

  // handlers
  const handleAddUser = async (payload) => {
    try {
      setLoading(true);
      showToast("Creating new user…", "info");
      const res = await UsersService.createUser?.(payload);
      if (res?.success) {
        setIsAddModalOpen(false);
        await loadUsers();
        showToast(`User "${payload.name}" created`, "success");
      } else {
        // optimistic fallback (demo)
        const newUser = {
          id: "tmp_" + Date.now(),
          name: payload.name,
          username: payload.username,
          email: payload.email,
          status: payload.status,
          createdAt: new Date().toISOString().split("T")[0],
          lastActive: null,
          posts: 0,
          followers: 0,
          avatar: `https://i.pravatar.cc/100?u=${payload.email}`,
        };
        setUsers((prev) => [newUser, ...prev]);
        setIsAddModalOpen(false);
        showToast(`User "${payload.name}" created (local)`, "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = async (updated) => {
    try {
      showToast("Updating user…", "info");
      const res = await UsersService.updateUser?.(updated.id, updated);
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
        );
        showToast("User updated", "success");
      } else {
        // optimistic
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
        );
        showToast("User updated (local)", "success");
      }
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      showToast("Deleting user…", "info");
      const res = await UsersService.deleteUser?.(selectedUser.id);
      if (res?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        showToast(`User "${selectedUser.name}" deleted`, "success");
      } else {
        // optimistic
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        showToast(`User "${selectedUser.name}" deleted (local)`, "success");
      }
    } catch {
      showToast("Failed to delete user", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

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
      const next = Math.min(p.totalPages, Math.max(1, p.page + dir));
      return { ...p, page: next };
    });
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
              <h1 className="text-xl font-semibold">Directory</h1>
              <span className="text-sm text-gray-600">
                ({pagination.total} total)
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2 md:justify-end">
              <div className="relative w-full md:w-72">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  className="w-full rounded-lg border pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search name, email, username, role…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    className="rounded-lg border px-3 py-2 text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    title="Filter by role"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r === "all"
                          ? "All Roles"
                          : r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    className="rounded-lg border px-3 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    title="Filter by status"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s === "all"
                          ? "All Status"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" /> Add Directory
                </button>
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
                  <th className="text-left px-4 py-3">Directory</th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("email")}
                  >
                    Email <SortIcon col="email" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("status")}
                  >
                    Status <SortIcon col="status" />
                  </th>
                  <th
                    className="text-right px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("posts")}
                  >
                    Posts <SortIcon col="posts" />
                  </th>
                  <th
                    className="text-right px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("followers")}
                  >
                    Followers <SortIcon col="followers" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("createdAt")}
                  >
                    Joined <SortIcon col="createdAt" />
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("lastActive")}
                  >
                    Last Active <SortIcon col="lastActive" />
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
                        <span className="ml-3">Loading users…</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-gray-600"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-gray-500">
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : u.status === "invited"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{u.posts}</td>
                      <td className="px-4 py-3 text-right">{u.followers}</td>
                      <td className="px-4 py-3">{u.createdAt || "—"}</td>
                      <td className="px-4 py-3">{u.lastActive || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 rounded-md border hover:bg-gray-50"
                            onClick={() => handleViewUser(u)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded-md border hover:bg-gray-50"
                            onClick={() =>
                              handleEditUser({
                                ...u,
                                status:
                                  u.status === "active"
                                    ? "suspended"
                                    : "active",
                              })
                            }
                            title={
                              u.status === "active" ? "Suspend" : "Activate"
                            }
                          >
                            {u.status === "active" ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            className="p-2 rounded-md border hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDeleteUser(u)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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
              Page <span className="font-medium">{pagination.page}</span> of{" "}
              <span className="font-medium">
                {Math.max(1, pagination.totalPages)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goPage(-1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 rounded-md border disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goPage(1)}
                disabled={pagination.page >= pagination.totalPages}
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
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
        onEdit={handleEditUser}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        targetName={selectedUser?.name}
      />
    </motion.div>
  );
}

/* ===========================
   Minimal UsersService sketch
   (Implement in: /services/usersService.js)
=========================== */
// Example (server should implement these endpoints):
// export const UsersService = {
//   async getAllUsers(params) {
//     return await axios
//       .get("/api/v1/admin/users", { params })
//       .then((r) => r.data);
//     // return { success: true, data: { users: [], total: 0 } };
//   },
//   async createUser(payload) {
//     // return await axios.post('/api/v1/admin/users', payload).then(r => r.data)
//     return { success: false };
//   },
//   async updateUser(id, payload) {
//     // return await axios.put(`/api/v1/admin/users/${id}`, payload).then(r => r.data)
//     return { success: false };
//   },
//   async deleteUser(id) {
//     // return await axios.delete(`/api/v1/admin/users/${id}`).then(r => r.data)
//     return { success: false };
//   },
// };
