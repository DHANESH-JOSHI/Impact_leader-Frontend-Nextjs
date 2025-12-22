"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { AuthService } from "@/services/authService";
import { authStorage } from "@/lib/storage";

const PRIMARY = "#2691ce";
const SECONDARY = "#646464";
const ACCENT = "#A5C93D";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only check auth on client side
    if (typeof window === 'undefined') return;
    
    // Check if already authenticated
    try {
      if (authStorage.isAuthenticated()) {
        const user = authStorage.getCurrentUser();
        const userRole = user?.role || user?.userRole;
        
        // Check if user is inactive
        if (user?.isActive === false) {
          // Clear inactive session
          authStorage.clearTokens();
          if (typeof document !== 'undefined') {
            document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
          }
          // Check URL params for error message
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('error') !== 'account_inactive') {
            router.replace("/user/login?error=account_inactive");
          }
          return;
        }
        
        // If admin is logged in, redirect to admin dashboard
        if (userRole === 'admin') {
          router.replace("/dashboard");
          return;
        }
        
        // If regular user is logged in, redirect to user dashboard
        if (userRole !== 'admin') {
          router.replace("/user/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }

    // Check for error messages in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error === 'account_inactive') {
      toast.error("Your account has been deactivated. Please contact support.");
      // Clean URL
      window.history.replaceState({}, "", "/user/login");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email) {
        toast.error("Email is required");
        setLoading(false);
        return;
      }
      if (!password) {
        toast.error("Password is required");
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const result = await AuthService.login(email, password);

      if (result.success) {
        // Check if user is active
        if (result.user?.isActive === false) {
          toast.error("Your account has been deactivated. Please contact support.");
          setError("Your account has been deactivated. Please contact support.");
          setLoading(false);
          return;
        }

        // Check if user is approved (for non-admin users)
        const userRole = result.user?.role || result.user?.userRole;
        if (userRole !== 'admin' && result.user?.isApproved === false) {
          toast.error("Your account is pending admin approval. Please wait for approval notification.");
          setError("Your account is pending admin approval. Please wait for approval notification.");
          setLoading(false);
          return;
        }

        // Check if user is admin - redirect to admin dashboard if admin
        if (userRole === 'admin') {
          toast.error("Please use the admin login page");
          setError("Please use the admin login page");
          setLoading(false);
          return;
        }

        const token = result.token || result.accessToken;
        if (token && typeof document !== 'undefined') {
          try {
            const cookieValue = `authToken=${token}; path=/; max-age=${
              24 * 60 * 60
            }; SameSite=Lax`;
            document.cookie = cookieValue;
          } catch (cookieError) {
            console.warn("Failed to set cookie:", cookieError);
          }
        }

        toast.success(`Welcome ${result.user?.firstName || "User"}! Redirecting…`);
        setTimeout(() => {
          try {
            router.push("/user/dashboard");
          } catch (navError) {
            console.error("Navigation error:", navError);
            window.location.href = "/user/dashboard";
          }
        }, 900);
      } else {
        const errorMessage = result.message || "Login failed";
        toast.error(errorMessage);
        
        // Handle specific error cases
        if (errorMessage.toLowerCase().includes('pending') || errorMessage.toLowerCase().includes('approval')) {
          setError("Your account is pending admin approval. Please wait for approval notification.");
        } else if (errorMessage.toLowerCase().includes('deactivated') || errorMessage.toLowerCase().includes('inactive')) {
          setError("Your account has been deactivated. Please contact support.");
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => setError("");

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: PRIMARY }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: ACCENT }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <LogIn className="h-8 w-8" style={{ color: PRIMARY }} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#040606" }}>
              User Login
            </h1>
            <p className="text-sm" style={{ color: SECONDARY }}>
              Sign in to your account
            </p>
            
            {/* Link to admin login */}
            <div className="mt-4">
              <a
                href="/"
                className="inline-flex items-center space-x-2 text-sm transition-colors hover:underline"
                style={{ color: PRIMARY }}
              >
                <span>Are you an admin?</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#040606" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: SECONDARY }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: PRIMARY }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#040606" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: SECONDARY }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: PRIMARY }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

