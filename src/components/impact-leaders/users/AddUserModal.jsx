"use client";

import React, { useState } from 'react';
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

// Import services
import { ImpactLeadersAuthService } from '@/services/impactLeadersAuthService';
import { UsersService } from '@/services/usersService';

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
    if (!formData.email) return 'Email is required';
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!formData.firstName) return 'First name is required';
    if (!formData.lastName) return 'Last name is required';
    if (!formData.companyName) return 'Company name is required';
    if (!formData.organizationType) return 'Organization type is required';
    if (!formData.designation) return 'Designation is required';
    if (selectedThemes.length === 0) return 'At least one theme is required';
    if (!formData.termsAccepted) return 'Terms and conditions must be accepted';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use the Impact Leaders registration API
      const response = await ImpactLeadersAuthService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        organizationType: formData.organizationType,
        designation: formData.designation,
        themes: selectedThemes,
        termsAccepted: formData.termsAccepted,
        ...(formData.referralCode && { referralCode: formData.referralCode })
      });

      if (response.success) {
        setSuccess('User registered successfully!');
        setTimeout(() => {
          onUserAdded();
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

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
  );
}