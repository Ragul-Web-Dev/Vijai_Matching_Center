import crypto from 'crypto';

// In-memory active tokens set with expiry (24 hours)
const activeTokens = new Map();

export const generateAdminToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeTokens.set(token, { expiresAt, role: 'admin' });
  return token;
};

export const verifyAdminToken = (token) => {
  if (!token) return false;
  const session = activeTokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  return true;
};

// Admin authentication middleware
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired admin session' });
  }

  next();
};
