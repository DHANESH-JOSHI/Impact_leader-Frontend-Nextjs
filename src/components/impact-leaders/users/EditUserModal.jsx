"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  X,
  User,
  Mail,
  Lock,
  Building,
  MapPin,
  Globe,
  Tag,
  Loader2,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from "framer-motion";
import { UsersService } from '@/services/usersService';
import { AdminService } from '@/services/adminService';

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
          className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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

export default function EditUserModal({ isOpen, onClose, user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    organizationType: '',
    designation: '',
    bio: '',
    experience: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: ''
    },
    themes: [],
    role: 'user',
    isActive: true,
    isApproved: false,
    isEmailVerified: false,
  });

  useEffect(() => {
    if (user && isOpen) {
      // Normalize themes: extract names from theme objects or use strings directly
      const normalizedThemes = Array.isArray(user.themes)
        ? user.themes.map(theme => {
            if (typeof theme === 'string') return theme;
            if (theme && typeof theme === 'object') return theme.name || String(theme._id || theme.id || theme);
            return String(theme);
          }).filter(Boolean)
        : [];

      // Handle location - can be object or string
      let locationData = { city: '', state: '', country: '' };
      if (user.location) {
        if (typeof user.location === 'object') {
          locationData = {
            city: user.location.city || '',
            state: user.location.state || '',
            country: user.location.country || ''
          };
        } else {
          // If it's a string, try to parse or use as city
          locationData.city = user.location;
        }
      }

      // Handle socialLinks - can be object or undefined
      let socialLinksData = { linkedin: '', twitter: '', website: '' };
      if (user.socialLinks && typeof user.socialLinks === 'object') {
        socialLinksData = {
          linkedin: user.socialLinks.linkedin || '',
          twitter: user.socialLinks.twitter || '',
          website: user.socialLinks.website || ''
        };
      }

      // Normalize organizationType to match enum values (case-insensitive)
      const validOrgTypes = ['startup', 'corporate', 'nonprofit', 'government', 'freelance', 'other'];
      let normalizedOrgType = '';
      if (user.organizationType) {
        const orgTypeLower = String(user.organizationType).toLowerCase().trim();
        // Find matching enum value (case-insensitive)
        const matchedType = validOrgTypes.find(type => type.toLowerCase() === orgTypeLower);
        normalizedOrgType = matchedType || orgTypeLower;
      }

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        companyName: user.companyName || '',
        organizationType: normalizedOrgType,
        designation: user.designation || '',
        bio: user.bio || '',
        experience: user.experience || '',
        phone: user.phone || '',
        location: locationData,
        socialLinks: socialLinksData,
        themes: normalizedThemes,
        role: user.role || 'user',
        isActive: user.isActive !== false,
        isApproved: user.isApproved || false,
        isEmailVerified: user.isEmailVerified || false,
      });
      setSelectedThemes(normalizedThemes);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleThemeToggle = (themeValue) => {
    const updatedThemes = selectedThemes.includes(themeValue)
      ? selectedThemes.filter(t => t !== themeValue)
      : [...selectedThemes, themeValue];

    setSelectedThemes(updatedThemes);
    setFormData(prev => ({
      ...prev,
      themes: updatedThemes
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return 'Please enter a valid email address';
    if (!formData.firstName || !formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName || !formData.lastName.trim()) return 'Last name is required';
    if (!formData.companyName || !formData.companyName.trim()) return 'Company name is required';
    if (!formData.organizationType || !formData.organizationType.trim()) return 'Organization type is required';
    if (!formData.designation || !formData.designation.trim()) return 'Designation is required';
    // Password is optional for updates
    if (formData.password && formData.password.length < 6) return 'Password must be at least 6 characters';
    // Validate organizationType is valid enum value (only if it has a value)
    const validOrgTypes = ['startup', 'corporate', 'nonprofit', 'government', 'freelance', 'other'];
    if (formData.organizationType && formData.organizationType.trim() && !validOrgTypes.includes(formData.organizationType.trim())) {
      return 'Invalid organization type';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // Prepare update data - only include fields that are allowed
      // Note: role is excluded as it cannot be updated through this endpoint
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        companyName: formData.companyName.trim(),
        designation: formData.designation.trim(),
        themes: Array.isArray(selectedThemes) ? selectedThemes : [],
        isActive: formData.isActive,
        isApproved: formData.isApproved,
        isEmailVerified: formData.isEmailVerified,
      };

      // Only include organizationType if it has a valid value (backend validator is optional)
      const validOrgTypes = ['startup', 'corporate', 'nonprofit', 'government', 'freelance', 'other'];
      if (formData.organizationType && formData.organizationType.trim() && validOrgTypes.includes(formData.organizationType.trim())) {
        updateData.organizationType = formData.organizationType.trim();
      }

      // Add optional fields if they have values
      if (formData.bio && formData.bio.trim()) updateData.bio = formData.bio.trim();
      if (formData.experience !== undefined && formData.experience !== '') {
        const exp = parseInt(formData.experience);
        if (!isNaN(exp) && exp >= 0 && exp <= 50) {
          updateData.experience = exp;
        }
      }
      if (formData.phone && formData.phone.trim()) updateData.phone = formData.phone.trim();
      
      // Handle location object
      if (formData.location && (formData.location.city || formData.location.state || formData.location.country)) {
        updateData.location = {};
        if (formData.location.city && formData.location.city.trim()) {
          updateData.location.city = formData.location.city.trim();
        }
        if (formData.location.state && formData.location.state.trim()) {
          updateData.location.state = formData.location.state.trim();
        }
        if (formData.location.country && formData.location.country.trim()) {
          updateData.location.country = formData.location.country.trim();
        }
      }
      
      // Handle socialLinks object
      if (formData.socialLinks && (formData.socialLinks.linkedin || formData.socialLinks.twitter || formData.socialLinks.website)) {
        updateData.socialLinks = {};
        if (formData.socialLinks.linkedin && formData.socialLinks.linkedin.trim()) {
          updateData.socialLinks.linkedin = formData.socialLinks.linkedin.trim();
        }
        if (formData.socialLinks.twitter && formData.socialLinks.twitter.trim()) {
          updateData.socialLinks.twitter = formData.socialLinks.twitter.trim();
        }
        if (formData.socialLinks.website && formData.socialLinks.website.trim()) {
          updateData.socialLinks.website = formData.socialLinks.website.trim();
        }
      }
      
      if (formData.password) updateData.password = formData.password;

      const response = await AdminService.updateUser(user.id || user._id, updateData);

      if (response.success) {
        setSuccess('User updated successfully!');
        toast.success('User updated successfully!');
        setTimeout(() => {
          if (onUpdate) {
            onUpdate(updateData);
          }
          handleClose();
        }, 1500);
      } else {
        // Extract error message from response
        let errorMessage = response.message || 'Update failed';
        
        // If there are validation errors, format them
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => err.msg || err.message || `${err.path}: ${err.msg || 'Invalid value'}`).join(', ');
          errorMessage = errorMessages || errorMessage;
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      // Extract error message from API response
      let errorMessage = 'Update failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg || err.message || `${err.path}: ${err.msg || 'Invalid value'}`).join(', ');
          errorMessage = errorMessages || errorData.message || errorMessage;
        } else {
          errorMessage = errorData.message || error.message || errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      companyName: '',
      organizationType: '',
      designation: '',
      bio: '',
      experience: '',
      phone: '',
      location: {
        city: '',
        state: '',
        country: ''
      },
      socialLinks: {
        linkedin: '',
        twitter: '',
        website: ''
      },
      themes: [],
      role: 'user',
      isActive: true,
      isApproved: false,
      isEmailVerified: false,
    });
    setSelectedThemes([]);
    setSuccess('');
    onClose();
  };

  const organizationTypes = UsersService.getOrganizationTypes();
  const themes = UsersService.getUserThemes();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit User">
      <Card className="border-0 shadow-none">
        <CardContent className="space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="pl-9 pr-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter bio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location-city"
                      value={formData.location.city}
                      onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
                      placeholder="City"
                      className="pl-9"
                    />
                  </div>
                  <Input
                    id="location-state"
                    value={formData.location.state}
                    onChange={(e) => handleNestedInputChange('location', 'state', e.target.value)}
                    placeholder="State"
                  />
                  <Input
                    id="location-country"
                    value={formData.location.country}
                    onChange={(e) => handleNestedInputChange('location', 'country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="social-linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                      placeholder="LinkedIn URL"
                      className="pl-9"
                    />
                  </div>
                  <Input
                    id="social-twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                    placeholder="Twitter URL"
                  />
                  <Input
                    id="social-website"
                    value={formData.socialLinks.website}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'website', e.target.value)}
                    placeholder="Website URL"
                  />
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Organization Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type *</Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) => handleInputChange('organizationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="Enter designation"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Themes/Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Areas of Interest
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {themes.map(theme => (
                  <div key={theme.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={theme.value}
                      checked={selectedThemes.includes(theme.value)}
                      onCheckedChange={() => handleThemeToggle(theme.value)}
                    />
                    <Label htmlFor={theme.value} className="text-sm cursor-pointer">
                      {theme.label}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedThemes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedThemes.map(theme => (
                    <Badge key={theme} variant="secondary">
                      {themes.find(t => t.value === theme)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Account Settings
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active Account
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isApproved"
                    checked={formData.isApproved}
                    onCheckedChange={(checked) => handleInputChange('isApproved', checked)}
                  />
                  <Label htmlFor="isApproved" className="cursor-pointer">
                    Approved
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isEmailVerified"
                    checked={formData.isEmailVerified}
                    onCheckedChange={(checked) => handleInputChange('isEmailVerified', checked)}
                  />
                  <Label htmlFor="isEmailVerified" className="cursor-pointer">
                    Email Verified
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update User
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ModalWrapper>
  );
}

