"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Store,
  ShoppingBag,
  TrendingUp,
  Globe,
  CheckCircle,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { authStorage } from "@/lib/storage";

// Brand colors
const PRIMARY = "#2490CE";
const ACCENT = "#A5C93D";

// ---------- Toast (JS version, no TS annotations)
const Toast = ({ message, type = "info", onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bg =
    type === "success"
      ? ACCENT
      : type === "error"
      ? "#ef4444"
      : type === "warning"
      ? "#eab308"
      : PRIMARY;

  const border =
    type === "success"
      ? ACCENT
      : type === "error"
      ? "#dc2626"
      : type === "warning"
      ? "#ca8a04"
      : PRIMARY;

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right will-change-transform">
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl shadow-xl p-4 min-w-[300px] max-w-[420px] backdrop-blur-md"
        style={{
          backgroundColor: bg,
          border: `1px solid ${border}`,
          color: "#fff",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 text-white" />
            <p className="text-white text-sm font-medium leading-5">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="ml-4 text-white/90 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Toast hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, isVisible: true }]);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, hideToast };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { toasts, showToast, hideToast } = useToast();

  const [showAnimation, setShowAnimation] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowAnimation(true);

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const message = urlParams.get("message");

    if (error) {
      switch (error) {
        case "login_required":
          showToast("Please login to access the dashboard", "error");
          break;
        case "session_expired":
          showToast("Your session has expired. Please login again.", "error");
          break;
        case "access_denied":
          showToast("Access denied. Admin privileges required.", "error");
          break;
        default:
          showToast("Please login to continue", "error");
      }
    }

    if (message) {
      switch (message) {
        case "logged_out":
          showToast("Successfully logged out", "success");
          break;
        default:
          showToast(message, "info");
      }
    }

    // Clean URL after showing messages
    if (error || message) {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email) {
        showToast("Email is required", "error");
        setLoading(false);
        return;
      }
      if (!password) {
        showToast("Password is required", "error");
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address", "error");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        setLoading(false);
        return;
      }

      // Call Next.js API route (standard structure)
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Login: Success response received:", data);

        // Extract auth data from nested response structure
        const authData = data.data || data;

        // Save tokens using centralized authStorage utility
        authStorage.saveTokens({
          accessToken: authData.accessToken || authData.token,
          refreshToken: authData.refreshToken,
          user: authData.user,
        });

        console.log("💾 Login: Tokens saved to storage");

        // Also set a cookie for server-side middleware
        const token = authData.accessToken || authData.token;
        const cookieValue = `authToken=${token}; path=/; max-age=${
          24 * 60 * 60
        }; SameSite=Lax`;
        document.cookie = cookieValue;
        console.log(
          "🍪 Login: Cookie set:",
          cookieValue.substring(0, 50) + "..."
        );

        // Verify token was stored correctly
        setTimeout(() => {
          const storedToken = authStorage.getAccessToken();
          console.log(
            "🔍 Login: Token verification:",
            storedToken ? `Present (${storedToken.substring(0, 20)}...)` : "Not found"
          );
        }, 100);

        showToast(
          `Welcome ${authData.user.firstName || "Admin"}! Redirecting…`,
          "success"
        );
        setTimeout(() => router.push("/dashboard"), 900);
      } else {
        console.log("❌ Login: Failed response:", data);
        showToast(data.message || "Login failed", "error");
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      showToast("Login failed. Please try again.", "error");
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => setError("");

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Global animations & decorative CSS */}
      <style jsx global>{`
        :root {
          --primary: ${PRIMARY};
          --accent: ${ACCENT};
        }
        @keyframes floatSlow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes floatMed {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(6px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        @keyframes floatFast {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0px);
            opacity: 1;
          }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: floatMed 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: floatFast 4.5s ease-in-out infinite;
        }
        .animate-slide-in-right {
          animation: slideInRight 300ms ease-out;
        }
        .noisy {
          background-image: radial-gradient(
              circle at 10% 10%,
              rgba(255, 255, 255, 0.06) 0 2px,
              transparent 3px
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(0, 0, 0, 0.04) 0 2px,
              transparent 3px
            );
          background-size: 120px 120px, 180px 180px;
        }
      `}</style>

      {/* Toasts */}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          isVisible={t.isVisible}
          onClose={() => hideToast(t.id)}
        />
      ))}

      {/* Background Layer: brand gradient */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `radial-gradient(1200px 800px at 20% 10%, ${ACCENT}22, transparent 60%),
                       radial-gradient(1000px 700px at 80% 20%, ${PRIMARY}22, transparent 60%),
                       linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
        }}
      />

      {/* Subtle texture + vignette */}
      <div className="fixed inset-0 -z-10 noisy opacity-50 pointer-events-none" />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ boxShadow: "inset 0 0 140px rgba(0,0,0,0.25)" }}
      />

      {/* Floating icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-25 animate-float-slow">
          <ShoppingBag size={44} className="text-white" />
        </div>
        <div className="absolute top-40 right-20 opacity-25 animate-float-medium">
          <Store size={56} className="text-white" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-25 animate-float-fast">
          <TrendingUp size={44} className="text-white" />
        </div>
        <div className="absolute bottom-60 right-10 opacity-25 animate-float-medium">
          <Globe size={56} className="text-white" />
        </div>
      </div>

      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 py-0 ${
          showAnimation
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <Card className="w-full border-0 overflow-hidden py-0 backdrop-blur-xl bg-white/90 shadow-[0_20px_80px_rgba(0,0,0,0.25)] rounded-2xl">
          {/* Header */}
          <div
            className="p-6"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-center text-white leading-tight">
                  Admin Login
                </CardTitle>
                <CardDescription className="text-center text-white/90 mt-1">
                  Admin Portal for Impact Leader
                </CardDescription>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Error Banner */}
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5" style={{ color: PRIMARY }} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setError("")}
                      autoComplete="email"
                      placeholder="name@company.com"
                      required
                      className="pl-10 rounded-xl border-gray-300"
                      style={{
                        boxShadow: `0 0 0 0px transparent`,
                      }}
                      onBlur={(e) => e.currentTarget.blur}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5" style={{ color: PRIMARY }} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setError("")}
                      autoComplete="current-password"
                      placeholder="Your secure password"
                      required
                      className="pl-10 pr-10 rounded-xl border-gray-300"
                      style={{
                        boxShadow: `0 0 0 0px transparent`,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-5 w-5"
                          style={{ color: PRIMARY }}
                        />
                      ) : (
                        <Eye className="h-5 w-5" style={{ color: PRIMARY }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white rounded-xl h-11 text-[15px] font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing…</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="pt-2 text-center text-xs text-gray-500">
                Secure by TechWithJoshi • v1.0
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
