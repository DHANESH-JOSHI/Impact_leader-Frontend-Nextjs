"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import UsersHeader from "@/components/users/UsersHeader";
import UsersCardView from "@/components/users/UsersCardView";
import UsersTableView from "@/components/users/UsersTableView";
import AddUserModal from "@/components/impact-leaders/users/AddUserModal";
import ViewUserModal from "@/components/impact-leaders/users/ViewUserModal";
import EditUserModal from "@/components/impact-leaders/users/EditUserModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
import { UsersService } from "@/services/usersService";
import { AdminService } from "@/services/adminService";

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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOrganization, setFilterOrganization] = useState("all");
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const roles = useMemo(() => [
    { value: "all", label: "All Roles" },
    ...UsersService.getUserRoles(),
  ], []);

  const statuses = useMemo(() => [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ], []);

  const organizations = useMemo(() => [
    { value: "all", label: "All Organizations" },
    ...UsersService.getOrganizationTypes(),
  ], []);

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.limit, filterRole, filterStatus, filterOrganization, searchQuery, sortBy, sortOrder]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(filterRole !== "all" && { role: filterRole }),
        ...(filterStatus !== "all" && { isActive: filterStatus === "active" }),
        ...(filterOrganization !== "all" && { organizationType: filterOrganization }),
      };

      const result = await AdminService.getAllUsersAdmin(params);

      if (result.success) {
        const usersData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = usersData.map((user) => ({
          id: user._id || user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          companyName: user.companyName,
          designation: user.designation,
          organizationType: user.organizationType,
          role: user.role,
          isActive: user.isActive !== false,
          createdAt: user.createdAt,
          profileImage: user.profileImage,
          bio: user.bio,
          phone: user.phone,
          location: user.location,
          themes: user.themes,
          socialLinks: user.socialLinks,
          ...user,
        }));

        setUsers(transformed);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || transformed.length,
          totalPages: paginationData.pages || Math.ceil((paginationData.total || transformed.length) / pagination.limit),
        }));
      } else {
        toast.error(result.message || "Failed to load users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error(error.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      // Use AuthService for registration
      const { AuthService } = await import("@/services/authService");
      const result = await AuthService.register(userData);

      if (result.success) {
        toast.success("User created successfully");
        setIsAddModalOpen(false);
        await loadUsers();
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeleteLoading(true);
      // Use AdminService for admin operations
      const result = await AdminService.deleteUser(userId);

      if (result.success) {
        toast.success("User deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await loadUsers();
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      setLoading(true);
      const result = await AdminService.updateUser(selectedUser.id, userData);

      if (result.success) {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
        setSelectedUser(null);
        await loadUsers();
      } else {
        toast.error(result.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filteredUsers = useMemo(() => {
    return users;
  }, [users]);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={cardVariants}>
        <UsersHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterOrganization={filterOrganization}
          setFilterOrganization={setFilterOrganization}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          roles={roles}
          statuses={statuses}
          organizations={organizations}
          onAddUser={() => setIsAddModalOpen(true)}
          totalUsers={pagination.total}
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
                Loading users...
              </p>
            </div>
          </motion.div>
        ) : filteredUsers.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No users found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <UsersCardView
            users={filteredUsers}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={(user) => {
              setSelectedUser(user);
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <UsersTableView
            users={filteredUsers}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={(user) => {
              setSelectedUser(user);
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

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={handleEditUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={() => {
          if (selectedUser) {
            handleDeleteUser(selectedUser.id);
          }
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : undefined}
        isLoading={deleteLoading}
      />
    </motion.div>
  );
}
