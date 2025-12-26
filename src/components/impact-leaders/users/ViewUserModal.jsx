"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Edit,
  X,
  User,
  Mail,
  Building,
  Calendar,
  Shield,
  Globe,
  Tag,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ViewUserModal({ isOpen, onClose, user, onEdit }) {
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(100, 100, 100, 0.3)",
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader 
            className="flex flex-row items-center justify-between space-y-0 pb-4 p-6 border-b border-gray-200"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <User className="h-6 w-6" style={{ color: "#2691ce" }} />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold" style={{ color: "#040606" }}>
                  User Details
                </CardTitle>
                <p className="text-sm" style={{ color: "#646464" }}>
                  User information and account status
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <motion.button
                  onClick={() => {
                    onEdit(user);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  style={{ backgroundColor: "#2691ce" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit User</span>
                </motion.button>
              )}
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>
          </CardHeader>

          <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
            <CardContent className="space-y-6 p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.designation}</p>
                <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                    {user.isEmailVerified ? "Email Verified" : "Email Not Verified"}
                  </Badge>
                  {user.isApproved && (
                    <Badge variant="default">Approved</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Personal & Organization Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">First Name</p>
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Name</p>
                      <p className="font-medium">{user.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                  {user.referralCode && (
                    <div>
                      <p className="text-sm text-gray-600">Referral Code</p>
                      <p className="font-mono font-medium">{user.referralCode}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organization Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{user.companyName}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.organizationType?.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-medium">{user.designation}</p>
                  </div>
                  {user.registrationSource && (
                    <div>
                      <p className="text-sm text-gray-600">Registration Source</p>
                      <p className="font-medium capitalize">{user.registrationSource}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            {(user.phone || user.location || user.socialLinks) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                  {user.location && (user.location.city || user.location.state || user.location.country) && (
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">
                        {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {user.socialLinks && (user.socialLinks.linkedin || user.socialLinks.twitter || user.socialLinks.website) && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Social Links</p>
                      <div className="flex flex-wrap gap-2">
                        {user.socialLinks.linkedin && (
                          <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        )}
                        {user.socialLinks.twitter && (
                          <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            Twitter
                          </a>
                        )}
                        {user.socialLinks.website && (
                          <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bio and Experience */}
            {(user.bio || user.experience !== undefined) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.bio && (
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="font-medium">{user.bio}</p>
                    </div>
                  )}
                  {user.experience !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium">{user.experience} years</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Themes and Interests */}
            {user.themes && user.themes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Areas of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.themes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {typeof theme === 'string' ? theme.replace('-', ' ') : (theme?.name || String(theme))}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Status & Privileges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Terms Accepted</span>
                    {user.termsAccepted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auto-Approve Privilege</span>
                    {user.hasAutoApprovePrivilege ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Account Approved</span>
                    {user.isApproved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  {user.referredBy && (
                    <div>
                      <p className="text-sm text-gray-600">Referred By</p>
                      <p className="font-medium">
                        {typeof user.referredBy === 'object' 
                          ? `${user.referredBy.firstName || ''} ${user.referredBy.lastName || ''}`.trim() || user.referredBy.email
                          : user.referredBy}
                      </p>
                    </div>
                  )}
                  {user.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-600">Rejection Reason</p>
                      <p className="font-medium text-red-600">{user.rejectionReason}</p>
                    </div>
                  )}
                  {user.approvedBy && (
                    <div>
                      <p className="text-sm text-gray-600">Approved By</p>
                      <p className="font-medium">
                        {typeof user.approvedBy === 'object' 
                          ? `${user.approvedBy.firstName || ''} ${user.approvedBy.lastName || ''}`.trim() || user.approvedBy.email
                          : user.approvedBy}
                      </p>
                    </div>
                  )}
                  {user.approvedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Approved At</p>
                      <p className="font-medium">{formatDate(user.approvedAt)}</p>
                    </div>
                  )}
                  {user.privilegeGrantedBy && (
                    <div>
                      <p className="text-sm text-gray-600">Privilege Granted By</p>
                      <p className="font-medium">
                        {typeof user.privilegeGrantedBy === 'object' 
                          ? `${user.privilegeGrantedBy.firstName || ''} ${user.privilegeGrantedBy.lastName || ''}`.trim() || user.privilegeGrantedBy.email
                          : user.privilegeGrantedBy}
                      </p>
                    </div>
                  )}
                  {user.privilegeGrantedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Privilege Granted At</p>
                      <p className="font-medium">{formatDate(user.privilegeGrantedAt)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                  </div>
                  {user.lastLogin && (
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium">{formatDate(user.lastLogin)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Technical Information */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 font-mono text-xs">{user.id || user._id}</span>
                  </div>
                  {user.referralCode && (
                    <div>
                      <span className="text-gray-600">Referral Code:</span>
                      <span className="ml-2 font-mono">{user.referralCode}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Email Verified:</span>
                    <Badge variant={user.isEmailVerified ? "default" : "secondary"} className="ml-2">
                      {user.isEmailVerified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Registration Source:</span>
                    <span className="ml-2 font-medium capitalize">{user.registrationSource}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}