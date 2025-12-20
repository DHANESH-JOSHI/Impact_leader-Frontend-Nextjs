import { NextResponse } from "next/server";
import { AuthService } from "@/services/authService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log(body);
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Call Impact Leaders API via our service
    const result = await AuthService.login(email, password);

    if (result.success) {
      // Check if user has admin role or admin privileges
      const user = result.user;
      const isAdmin =
        user.role === "admin" ||
        user.role === "super-admin" ||
        user.isAdmin === true ||
        (user.permissions && user.permissions.includes("admin_access"));

      if (!isAdmin) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Access denied. Admin privileges required to access this dashboard.",
          },
          { status: 403 }
        );
      }

      // Store tokens in our auth service for subsequent requests
      AuthService.setStoredTokens({
        accessToken: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
      });

      return NextResponse.json({
        success: true,
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
        message: "Admin login successful",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Login failed",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Impact Leaders login API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
