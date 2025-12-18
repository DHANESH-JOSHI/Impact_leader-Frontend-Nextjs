"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Building,
  Briefcase,
  Tag,
  Shield,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    designation: '',
    organizationType: 'corporate',
    themes: [],
    role: 'user',
    isActive: true,
    isEmailVerified: false,
    isApproved: false,
    hasAutoApprovePrivilege: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        companyName: user.companyName || '',
        designation: user.designation || '',
        organizationType: user.organizationType || 'corporate',
        themes: user.themes || [],
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
        isEmailVerified: user.isEmailVerified || false,
        isApproved: user.isApproved || false,
        hasAutoApprovePrivilege: user.hasAutoApprovePrivilege || false,
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...user, ...formData });
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = (theme) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const availableThemes = [
    'technology',
    'health',
    'education',
    'environment',
    'management',
    'finance',
    'marketing',
    'innovation'
  ];

  const organizationTypes = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'ngo', label: 'NGO' },
    { value: 'government', label: 'Government' },
    { value: 'startup', label: 'Startup' },
    { value: 'educational', label: 'Educational' }
  ];

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-xl font-bold">Edit User</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <select
                      id="organizationType"
                      value={formData.organizationType}
                      onChange={(e) => handleChange('organizationType', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                      required
                    >
                      {organizationTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => handleChange('designation', e.target.value)}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Themes/Areas of Interest */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Areas of Interest
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableThemes.map(theme => (
                    <Badge
                      key={theme}
                      variant={formData.themes.includes(theme) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => handleThemeToggle(theme)}
                    >
                      {theme.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Role & Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">User Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Active Status</Label>
                      <p className="text-sm text-gray-600">User can access the platform</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleChange('isActive', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Email Verified</Label>
                      <p className="text-sm text-gray-600">Email address is confirmed</p>
                    </div>
                    <Switch
                      checked={formData.isEmailVerified}
                      onCheckedChange={(checked) => handleChange('isEmailVerified', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Account Approved</Label>
                      <p className="text-sm text-gray-600">User is approved by admin</p>
                    </div>
                    <Switch
                      checked={formData.isApproved}
                      onCheckedChange={(checked) => handleChange('isApproved', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Auto-Approve Privilege</Label>
                      <p className="text-sm text-gray-600">Can auto-approve content</p>
                    </div>
                    <Switch
                      checked={formData.hasAutoApprovePrivilege}
                      onCheckedChange={(checked) => handleChange('hasAutoApprovePrivilege', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
