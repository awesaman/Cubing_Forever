const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  // make sure token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify that the token is correct
  try {
    jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ msg: 'Invalid token, authorization denied' });
      } else {
        req.user = decoded.user; // success, return the authorized user
        next();
      }
    });
  } catch (err) {
    console.error('Error with auth middleware');
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
