import jwt from 'jsonwebtoken'

export const generateToken = (req) => {
  const token = jwt.sign({ id: req._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};