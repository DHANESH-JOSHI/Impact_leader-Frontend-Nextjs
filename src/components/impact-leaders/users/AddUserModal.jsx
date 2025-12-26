"use client";

import React, { useState } from 'react';
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
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from "framer-motion";

// Import services
import { AuthService } from '@/services/authService';
import { UsersService } from '@/services/usersService';

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
export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    organizationType: '',
    designation: '',
    themes: [],
    termsAccepted: false,
    referralCode: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
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
    // Email validation
    if (!formData.email || !formData.email.trim()) {
      toast.error('Email is required');
      return 'Email is required';
    }
    const email = formData.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return 'Please enter a valid email address';
    }
    if (email.length > 100) {
      toast.error('Email must be less than 100 characters');
      return 'Email must be less than 100 characters';
    }

    // Password validation
    if (!formData.password || formData.password.trim().length === 0) {
      toast.error('Password is required');
      return 'Password is required';
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return 'Password must be at least 6 characters';
    }
    if (formData.password.length > 128) {
      toast.error('Password must be less than 128 characters');
      return 'Password must be less than 128 characters';
    }

    // First name validation
    if (!formData.firstName || !formData.firstName.trim()) {
      toast.error('First name is required');
      return 'First name is required';
    }
    const firstName = formData.firstName.trim();
    if (firstName.length > 50) {
      toast.error('First name must be less than 50 characters');
      return 'First name must be less than 50 characters';
    }

    // Last name validation
    if (!formData.lastName || !formData.lastName.trim()) {
      toast.error('Last name is required');
      return 'Last name is required';
    }
    const lastName = formData.lastName.trim();
    if (lastName.length > 50) {
      toast.error('Last name must be less than 50 characters');
      return 'Last name must be less than 50 characters';
    }

    // Company name validation
    if (!formData.companyName || !formData.companyName.trim()) {
      toast.error('Company name is required');
      return 'Company name is required';
    }
    const companyName = formData.companyName.trim();
    if (companyName.length > 100) {
      toast.error('Company name must be less than 100 characters');
      return 'Company name must be less than 100 characters';
    }

    // Organization type validation
    if (!formData.organizationType || !formData.organizationType.trim()) {
      toast.error('Organization type is required');
      return 'Organization type is required';
    }
    const validOrgTypes = ['startup', 'corporate', 'nonprofit', 'government', 'freelance', 'other'];
    if (!validOrgTypes.includes(formData.organizationType.trim())) {
      toast.error('Invalid organization type. Please select a valid option');
      return 'Invalid organization type';
    }

    // Designation validation
    if (!formData.designation || !formData.designation.trim()) {
      toast.error('Designation is required');
      return 'Designation is required';
    }
    const designation = formData.designation.trim();
    if (designation.length > 100) {
      toast.error('Designation must be less than 100 characters');
      return 'Designation must be less than 100 characters';
    }

    // Themes validation
    if (selectedThemes.length === 0) {
      toast.error('Please select at least one area of interest (theme)');
      return 'At least one theme is required';
    }

    // Terms validation
    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions to continue');
      return 'Terms and conditions must be accepted';
    }

    // Referral code validation (optional)
    if (formData.referralCode && formData.referralCode.trim().length > 50) {
      toast.error('Referral code must be less than 50 characters');
      return 'Referral code must be less than 50 characters';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors and success messages
    setError('');
    setSuccess('');

    // Validate form - toast messages are shown in validateForm
    const validationError = validateForm();
    if (validationError) {
      // Error already shown as toast in validateForm
      return;
    }

    setLoading(true);

    try {
      // Use the OnePurpos registration API
      const response = await AuthService.register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        companyName: formData.companyName.trim(),
        organizationType: formData.organizationType,
        designation: formData.designation.trim(),
        themes: Array.isArray(selectedThemes) ? selectedThemes : [],
        termsAccepted: formData.termsAccepted === true || formData.termsAccepted === 'true',
        ...(formData.referralCode && { referralCode: formData.referralCode.trim() })
      });

      if (response.success) {
        setSuccess('User registered successfully!');
        toast.success('User registered successfully!');
        setTimeout(() => {
          onUserAdded();
          handleClose();
        }, 1500);
      } else {
        // Extract error message from response
        let errorMessage = response.message || 'Registration failed';
        
        // If there are validation errors, format them
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => err.msg || err.message || `${err.path}: ${err.msg || 'Invalid value'}`).join(', ');
          errorMessage = errorMessages || errorMessage;
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      // Extract error message from API response
      let errorMessage = 'Registration failed';
      
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
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      companyName: '',
      organizationType: '',
      designation: '',
      themes: [],
      termsAccepted: false,
      referralCode: ''
    });
    setSelectedThemes([]);
    setError('');
    setSuccess('');
    onClose();
  };

  const organizationTypes = UsersService.getOrganizationTypes();
  const themes = UsersService.getUserThemes();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New User">

      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Add New User</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

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
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter password (min 6 characters)"
                        className="pl-9 pr-9"
                        required
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
                    Areas of Interest *
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

                {/* Optional Referral */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                    <Input
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) => handleInputChange('referralCode', e.target.value)}
                      placeholder="Enter referral code (if any)"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                      required
                    />
                    <Label htmlFor="termsAccepted" className="text-sm leading-relaxed cursor-pointer">
                      I accept the terms and conditions and privacy policy *
                    </Label>
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
                        Registering...
                      </>
                    ) : (
                      'Register User'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModalWrapper>
  );
}