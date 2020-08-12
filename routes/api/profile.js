const express = require('express');
const router = express.Router();
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// add a note that they must enter all events that they practice so interface can be customized for them

// @route    GET api/profile/me
// @desc     Get logged in user's profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['username', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'username',
      'avatar',
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:id
// @desc     Get profile by user ID
// @access   Private
router.get(
  '/user/:id',
  [auth, checkObjectId('id')],
  async ({ params: { id } }, res) => {
    try {
      const profile = await Profile.findOne({
        user: id,
      }).populate('user', ['username', 'avatar']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [auth, [check('events', 'Events are required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      bio,
      wcaid,
      location,
      events,
      youtube,
      twitter,
      instagram,
      facebook,
    } = req.body;

    const profileFields = {
      user: req.user.id,
      bio,
      wcaid,
      location,
      events,
    };

    const socialfields = { youtube, twitter, instagram, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value && value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/profile/solve
// @desc     Add solve
// @access   Private
router.put(
  '/solve/:event',
  [
    auth,
    [
      check('sessionID', 'Session ID is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('scramble', 'Scramble is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { sessionID, time, scramble } = req.body;
    sessionID -= 1;
    const newSolve = { time, scramble };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      for (e in profile.events) {
        if (profile.events[e].name === req.params.event) {
          if (profile.events[e].solves.length === sessionID)
            profile.events[e].solves.push([newSolve]);
          else profile.events[e].solves[sessionID].push(newSolve);
          break;
        }
      }
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/solve/:event/:session/:id
// @desc     Delete a solve
// @access   Private

router.delete('/solve/:event/:session/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    for (e in profile.events) {
      if (profile.events[e].name === req.params.event) {
        profile.events[e].solves = profile.events[e].solves[
          req.params.session - 1
        ].filter(sol => sol._id.toString() !== req.params.id);
        break;
      }
    }
    await profile.save();
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    DELETE api/profile
// @desc     Delete profile and user
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
