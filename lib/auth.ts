import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '@prisma/client';

// JWT secret key - in a real app, this would be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token expiration time
const EXPIRES_IN = '7d';

// User data to include in the token (exclude sensitive fields)
type TokenUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const tokenUser: TokenUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  
  return jwt.sign(tokenUser, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Set the JWT token as a cookie in the response
 */
export function setTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Get the current user from the request
 */
export function getCurrentUser(request: NextRequest): TokenUser | null {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    return jwt.verify(token, JWT_SECRET) as TokenUser;
  } catch (error) {
    return null;
  }
}

/**
 * Clear the token cookie
 */
export function clearTokenCookie(response: NextResponse): void {
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
