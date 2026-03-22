const jwt = require('jsonwebtoken');

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

function verifyAuthToken(req, res) {
  const token = getTokenFromHeader(req);
  if (!token) {
    res.status(401).json({ message: 'Missing or invalid Authorization header.' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
    return null;
  }
}

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

module.exports = { getTokenFromHeader, verifyAuthToken, applyCors };
