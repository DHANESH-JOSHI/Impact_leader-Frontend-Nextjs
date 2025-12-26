"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  ShoppingBag,
  TrendingUp,
  Globe,
  AlertCircle,
  ExternalLink,
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
import { AuthService } from "@/services/authService";
import toast from "react-hot-toast";

// Brand colors
const PRIMARY = "#2490CE";
const ACCENT = "#A5C93D";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showAnimation, setShowAnimation] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowAnimation(true);

    // Check if user is already authenticated - redirect based on role
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("onePurposAuth");
        if (authData) {
          const parsed = JSON.parse(authData);
          const token = parsed?.value?.accessToken || parsed?.accessToken;
          const user = parsed?.value?.user || parsed?.user;
          
          if (token) {
            const userRole = user?.role || user?.userRole;
            
            // Check if user is inactive
            if (user?.isActive === false) {
              // Clear inactive session
              localStorage.removeItem("onePurposAuth");
              if (typeof document !== 'undefined') {
                document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
              }
              // Check URL params for error message
              const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.get('error') !== 'account_inactive') {
                router.replace("/?error=account_inactive");
              }
              return;
            }
            
            // If admin, redirect to admin dashboard
            if (userRole === 'admin') {
              router.replace("/dashboard");
              return;
            }
            
            // If regular user, redirect to user dashboard
            router.replace("/user/dashboard");
            return;
          }
        }
      } catch (error) {
        // Ignore errors, allow login page to show
        console.error("Auth check error:", error);
      }
    };

    checkAuth();

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const message = urlParams.get("message");

    if (error) {
      switch (error) {
        case "login_required":
          toast.error("Please login to access the dashboard");
          break;
        case "session_expired":
          toast.error("Your session has expired. Please login again.");
          break;
        case "access_denied":
          toast.error("Access denied. Admin privileges required.");
          break;
        case "account_inactive":
          toast.error("Your account has been deactivated. Please contact support.");
          break;
        default:
          toast.error("Please login to continue");
      }
    }

    if (message) {
      switch (message) {
        case "logged_out":
          toast.success("Successfully logged out");
          break;
        default:
          toast(message);
      }
    }

    // Clean URL after showing messages
    if (error || message) {
      window.history.replaceState({}, "", "/");
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

      // Use AuthService which handles API proxying correctly through /api/proxy
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

        // Check user role - admin login page should only allow admins
        if (userRole !== 'admin') {
          toast.error("Please use the user login page");
          setError("Please use the user login page");
          setLoading(false);
          return;
        }

        // AuthService already saves tokens, but set cookie for server-side middleware
        const token = result.token || result.accessToken;
        if (token) {
          const cookieValue = `authToken=${token}; path=/; max-age=${
            24 * 60 * 60
          }; SameSite=Lax`;
          document.cookie = cookieValue;
        }

        // Verify token was stored correctly
        setTimeout(() => {
          const storedToken = authStorage.getAccessToken();
          console.log(
            "🔍 Login: Token verification:",
            storedToken ? `Present (${storedToken.substring(0, 20)}...)` : "Not found"
          );
        }, 100);

        toast.success(`Welcome ${result.user?.firstName || "Admin"}! Redirecting…`);
        setTimeout(() => router.push("/dashboard"), 900);
      } else {
        console.log("❌ Login: Failed response:", result);
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
                  Admin Portal for OnePurpos
                </CardDescription>
              </div>
            </div>
            
            {/* Link to user login */}
            <div className="text-center mt-4">
              <a
                href="/user/login"
                className="inline-flex items-center space-x-2 text-sm transition-colors hover:underline text-white/90 hover:text-white"
              >
                <span>Are you a regular user?</span>
                <ExternalLink className="h-4 w-4" />
              </a>
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
