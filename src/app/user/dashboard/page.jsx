"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { authStorage } from "@/lib/storage";
import { apiClient } from "@/lib/apiClient";

const PRIMARY = "#2691ce";
const DANGER = "#ef4444";

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Only check auth on client side
    if (typeof window === 'undefined') {
      setCheckingAuth(false);
      return;
    }
    
    // Redirect to login if not authenticated
    try {
      const isAuth = authStorage.isAuthenticated();
      if (!isAuth) {
        router.replace("/user/login");
      } else {
        setCheckingAuth(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.replace("/user/login");
    }
  }, [router]);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Backend endpoint: DELETE /api/v1/users/account
      const response = await apiClient.delete("/users/account");
      
      // Handle different response structures
      const backendResponse = response?.data || {};
      const isSuccess = response?.success === true || backendResponse?.success === true;

      if (isSuccess) {
        // Clear auth tokens
        try {
          authStorage.clearTokens();
        } catch (storageError) {
          console.warn("Failed to clear storage:", storageError);
        }

        // Clear cookie
        if (typeof document !== 'undefined') {
          try {
            document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
            // Also try to clear all possible cookie variations
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          } catch (cookieError) {
            console.warn("Failed to clear cookie:", cookieError);
          }
        }

        toast.success("Your account has been deleted successfully");
        setTimeout(() => {
          try {
            router.push("/user/login");
          } catch (navError) {
            console.error("Navigation error:", navError);
            window.location.href = "/user/login";
          }
        }, 1000);
      } else {
        const errorMessage = backendResponse?.message || response?.message || "Failed to delete account";
        toast.error(errorMessage);
        setLoading(false);
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Failed to delete account. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication on client side only
  if (typeof window !== 'undefined') {
    try {
      if (!authStorage.isAuthenticated()) {
        return null; // Will redirect via useEffect
      }
    } catch (error) {
      console.error("Auth check error:", error);
      return null; // Will redirect via useEffect
    }
  } else {
    // SSR: return loading state
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#040606" }}>
              User Dashboard
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage your account
            </p>
          </div>

          {/* Delete Account Button */}
          {!showConfirm ? (
            <motion.button
              onClick={() => setShowConfirm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center space-x-2"
              style={{ backgroundColor: DANGER }}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete My Account</span>
            </motion.button>
          ) : (
            <div className="space-y-4">
              {/* Warning Message */}
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">
                      Are you sure?
                    </h3>
                    <p className="text-sm text-red-700">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{ backgroundColor: DANGER }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      <span>Yes, Delete Account</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

