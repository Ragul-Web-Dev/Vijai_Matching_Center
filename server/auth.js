import crypto from 'crypto';

// In-memory active tokens set with expiry (12 hours)
const activeTokens = new Map();

// Rate limiting and Brute-force protection for admin login attempts
// Track failed attempts: IP -> { count, lockedUntil }
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Check if an IP address is currently rate-limited/locked out
 */
export const checkLoginRateLimit = (ip) => {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };

  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    const remainingMinutes = Math.ceil((attempt.lockedUntil - Date.now()) / (60 * 1000));
    return {
      isLocked: true,
      remainingMinutes,
      message: `Too many failed login attempts. Portal temporarily locked for ${remainingMinutes} minute(s).`
    };
  }

  // Reset if lockout expired
  if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
    loginAttempts.delete(ip);
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
  return { isLocked: false, remainingAttempts: remaining };
};

/**
 * Record a failed login attempt for IP
 */
export const recordFailedLogin = (ip) => {
  const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  attempt.count += 1;

  if (attempt.count >= MAX_FAILED_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  loginAttempts.set(ip, attempt);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
  return {
    isLocked: attempt.count >= MAX_FAILED_ATTEMPTS,
    remainingAttempts: remaining,
    lockedMinutes: 15
  };
};

/**
 * Clear failed login attempts on successful authentication
 */
export const resetLoginAttempts = (ip) => {
  loginAttempts.delete(ip);
};

/**
 * Constant-time safe string comparison to prevent timing attacks
 */
export const timingSafeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufferA = Buffer.from(a, 'utf-8');
  const bufferB = Buffer.from(b, 'utf-8');
  if (bufferA.length !== bufferB.length) {
    // Perform dummy comparison to keep constant time
    crypto.timingSafeEqual(bufferA, bufferA);
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};

/**
 * Generate cryptographically strong session token with expiration (12 hours)
 */
export const generateAdminToken = (adminData = {}) => {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  activeTokens.set(token, {
    expiresAt,
    role: 'admin',
    createdAt: Date.now(),
    username: adminData.username || 'admin'
  });
  return token;
};

/**
 * Verify session token validity and expiration
 */
export const verifyAdminToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  const session = activeTokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  return true;
};

/**
 * Invalidate/Revoke session token on admin logout
 */
export const revokeAdminToken = (token) => {
  if (token && activeTokens.has(token)) {
    activeTokens.delete(token);
    return true;
  }
  return false;
};

/**
 * Admin authentication middleware with Bearer token validation
 */
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Security token required to access Studio Admin Portal'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin session expired or invalid. Please sign in again.'
    });
  }

  next();
};

/**
 * Sanitize text strings against script injection (XSS)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};
