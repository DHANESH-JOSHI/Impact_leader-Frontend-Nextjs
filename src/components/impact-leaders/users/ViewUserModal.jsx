"use client";

import React from 'react';
import {
  X,
  User,
  Mail,
  Building,
  MapPin,
  Calendar,
  Shield,
  Globe,
  Tag,
  Phone,
  Users,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ViewUserModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold">User Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600">{user.designation}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {user.referralCode && (
                      <Badge variant="outline">
                        Referral: {user.referralCode}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {user.location.city}, {user.location.state}, {user.location.country}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">{user.companyName}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.organizationType?.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-medium">{user.designation}</p>
                  </div>
                  {user.experience && (
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium">{user.experience} years</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

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
                      <Badge key={index} variant="secondary">
                        {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bio and Additional Info */}
            {user.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{user.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Account Information
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
                  {user.lastLoginAt && (
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium">{formatDate(user.lastLoginAt)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activity Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.stats ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Posts</span>
                        <span className="font-medium">{user.stats.postsCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Connections</span>
                        <span className="font-medium">{user.stats.connectionsCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Resources Shared</span>
                        <span className="font-medium">{user.stats.resourcesCount || 0}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No activity stats available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Skills and Certifications */}
            {(user.skills || user.certifications) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.skills && user.skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {user.certifications && user.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {user.certifications.map((cert, index) => (
                          <div key={index} className="border-l-2 border-blue-200 pl-3">
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            {cert.date && (
                              <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* User ID and Technical Info */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 font-mono">{user.id || user._id}</span>
                  </div>
                  {user.referralCode && (
                    <div>
                      <span className="text-gray-600">Referral Code:</span>
                      <span className="ml-2 font-mono">{user.referralCode}</span>
                    </div>
                  )}
                  {user.emailVerified !== undefined && (
                    <div>
                      <span className="text-gray-600">Email Verified:</span>
                      <Badge variant={user.emailVerified ? "default" : "secondary"} className="ml-2">
                        {user.emailVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                  {user.twoFactorEnabled !== undefined && (
                    <div>
                      <span className="text-gray-600">2FA Enabled:</span>
                      <Badge variant={user.twoFactorEnabled ? "default" : "secondary"} className="ml-2">
                        {user.twoFactorEnabled ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}