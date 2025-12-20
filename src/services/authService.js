import { generateToken, hashPassword, comparePassword } from "@/lib/auth";

// Mock user database - replace with actual database calls
const mockUsers = [
  {
    id: 1,
    email: "admin@demo.com",
    password: "demo123", // Plain text for demo
    role: "admin",
    name: "Admin User",
  },
];

export class AuthService {
  static async login(email, password) {
    try {
      // Find user by email
      const user = mockUsers.find((u) => u.email === email);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify password - simple comparison for demo
      const isValid = user.password === password;

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async register(userData) {
    try {
      const { email, password, name } = userData;

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        email,
        password: hashedPassword,
        role: "user",
        name,
      };

      mockUsers.push(newUser);

      return {
        success: true,
        message: "User created successfully",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async getCurrentUser(userId) {
    try {
      const user = mockUsers.find((u) => u.id === userId);

      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      };
    } catch (error) {
      console.error("Get user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

}
