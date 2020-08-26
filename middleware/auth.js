const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();
module.exports = function (req, res, next) {
  // receive token from header
  const token = req.header('x-auth-token');

  // make sure it exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify that the token is correct
  try {
    // jwt.verify(token, config.get('JWThiddenkey'), (error, decoded) => {
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
    res.status(500).json({ msg: 'Server Error' });
  }
};
