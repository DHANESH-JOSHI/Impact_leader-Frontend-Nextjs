"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Edit,
  Eye,
  Trash2,
  Mail,
  MapPin,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

// Import services
import { UsersService } from '@/services/usersService';

// Import modals
import AddUserModal from '@/components/impact-leaders/users/AddUserModal';
import ViewUserModal from '@/components/impact-leaders/users/ViewUserModal';
import DeleteConfirmModal from '@/components/impact-leaders/users/DeleteConfirmModal';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.limit, searchTerm, selectedOrganizationType, selectedRole, selectedTheme]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        organizationType: selectedOrganizationType || undefined,
        role: selectedRole || undefined,
        themes: selectedTheme || undefined
      };

      const response = await UsersService.getAllUsers(params);

      if (response.success) {
        setUsers(response.data || []);

        // Update pagination if available
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.pages
          }));
        }

        // Calculate stats
        const totalUsers = response.data?.length || 0;
        setStats({
          total: totalUsers,
          active: response.data?.filter(user => user.isActive)?.length || 0,
          inactive: response.data?.filter(user => !user.isActive)?.length || 0,
          newThisMonth: response.data?.filter(user => {
            const userDate = new Date(user.createdAt);
            const now = new Date();
            const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
            return userDate >= monthAgo;
          })?.length || 0
        });
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setPagination(prev => ({ ...prev, page: 1 }));

    switch (filterType) {
      case 'organizationType':
        setSelectedOrganizationType(value);
        break;
      case 'role':
        setSelectedRole(value);
        break;
      case 'theme':
        setSelectedTheme(value);
        break;
    }
  };

  const handleUserAdded = () => {
    setShowAddModal(false);
    loadUsers();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await UsersService.toggleUserStatus(userId, currentStatus);
      if (response.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await UsersService.exportUsers({ format: 'csv' });
      if (response.success) {
        // Handle file download
        console.log('Export successful:', response.data);
      }
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganizationTypeIcon = (type) => {
    switch (type) {
      case 'corporate': return <Building className="h-4 w-4" />;
      case 'ngo': return <Users className="h-4 w-4" />;
      case 'government': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-2">Loading users...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage Impact Leaders app users and registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportUsers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">{stats.newThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>

            <Select value={selectedOrganizationType} onValueChange={(value) => handleFilterChange('organizationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {UsersService.getOrganizationTypes().map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={(value) => handleFilterChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {UsersService.getUserRoles().map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTheme} onValueChange={(value) => handleFilterChange('theme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Themes</SelectItem>
                {UsersService.getUserThemes().map(theme => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedOrganizationType('');
                setSelectedRole('');
                setSelectedTheme('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({stats.total})</CardTitle>
          <CardDescription>
            Manage user accounts and registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedOrganizationType || selectedRole || selectedTheme
                  ? "Try adjusting your search criteria"
                  : "Start by adding your first user"}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id || user._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center">
                            {getOrganizationTypeIcon(user.organizationType)}
                            <span className="ml-1">{user.companyName}</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {user.location.city}, {user.location.country}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant="outline">
                            {user.organizationType}
                          </Badge>
                          {user.themes?.slice(0, 2).map(theme => (
                            <Badge key={theme} variant="secondary">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id || user._id, user.isActive)}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {showViewModal && selectedUser && (
        <ViewUserModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          user={selectedUser}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleUserDeleted}
          user={selectedUser}
        />
      )}
    </div>
  );
}