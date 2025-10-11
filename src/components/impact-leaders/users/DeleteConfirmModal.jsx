"use client";

import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  Loader2,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import services
import { UsersService } from '@/services/usersService';

export default function DeleteConfirmModal({ isOpen, onClose, user, onUserDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await UsersService.deleteUser(user.id || user._id);

      if (response.success) {
        onUserDeleted();
        onClose();
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete User
            </CardTitle>
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

            {/* User Information */}
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {user.companyName}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-800">
                      Are you sure you want to delete this user?
                    </h4>
                    <p className="text-red-700 text-sm">
                      This action cannot be undone. Deleting this user will permanently remove:
                    </p>
                    <ul className="text-red-700 text-sm space-y-1 ml-4">
                      <li>• User profile and personal information</li>
                      <li>• All posts and content created by this user</li>
                      <li>• Connection history and relationships</li>
                      <li>• Messages and conversation history</li>
                      <li>• Meeting participation records</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-medium">
                  Please type the user's email address to confirm deletion:
                </p>
                <p className="text-yellow-700 text-sm mt-1 font-mono bg-yellow-100 px-2 py-1 rounded">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
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
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Delete User
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}