const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route    POST api/user
// @desc     Register new user
// @access   Public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // check that there are no errors remaining
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        { forceHttps: true }
      );

      user = new User({
        username,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); // save to DB

      const payload = {
        user: {
          id: user.id, // MongoDB ObjectID
        },
      };

      // login user after registered in DB
      jwt.sign(
        payload,
        config.get('JWThiddenkey'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
