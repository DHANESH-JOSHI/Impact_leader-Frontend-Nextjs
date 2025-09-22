import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const setAuthCookie = (token) => {
  Cookies.set('authToken', token, {
    expires: 1, // 1 day
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getAuthToken = () => {
  return Cookies.get('authToken');
};

export const removeAuthCookie = () => {
  Cookies.remove('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    verifyToken(token);
    return true;
  } catch {
    return false;
  }
};
