const express = require('express');
const router = express.Router();
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const average = require('../../utils/average');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

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
      // this allows for both creating and updating profiles
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

// @route    GET api/profile/solve/:event
// @desc     Get last solving session for an event
// @access   Private

router.get('/solve/:event', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['username', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    for (e in profile.events) {
      const ev = profile.events[e];
      if (ev.name === req.params.event) {
        res.json(ev.sessions[ev.sessions.length - 1]);
        break;
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/solve/:event
// @desc     Add solve
// @access   Private
router.put(
  '/solve/:event',
  [
    auth,
    [
      check('time', 'Time is required').not().isEmpty(),
      check('scramble', 'Scramble is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { time, scramble } = req.body;
    const newSolve = { time, scramble };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      for (e in profile.events) {
        const ev = profile.events[e];
        if (ev.name === req.params.event) {
          profile.events[e].sessions[ev.sessions.length - 1].solves.push(
            newSolve
          );
          const sols =
            profile.events[e].sessions[ev.sessions.length - 1].solves;
          const len = sols.length;
          profile.events[e].sessions[ev.sessions.length - 1].numsolves = len;
          profile.events[e].sessions[ev.sessions.length - 1].mean = average(
            sols,
            len,
            true
          );
          if (len >= 3) {
            profile.events[e].sessions[ev.sessions.length - 1].cmo3 = average(
              sols,
              3,
              true
            );
            if (len == 3) {
              profile.events[e].sessions[ev.sessions.length - 1].bmo3 = average(
                sols,
                3,
                true
              );
            } else {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bmo3 = Math.min(
                profile.events[e].sessions[ev.sessions.length - 1].bmo3,
                profile.events[e].sessions[ev.sessions.length - 1].cmo3
              );
            }
          }
          if (len >= 5) {
            profile.events[e].sessions[ev.sessions.length - 1].cavg5 = average(
              sols,
              5
            );
            if (len == 5) {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg5 = average(sols, 5);
            } else {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg5 = Math.min(
                profile.events[e].sessions[ev.sessions.length - 1].bavg5,
                profile.events[e].sessions[ev.sessions.length - 1].cavg5
              );
            }
          }
          if (len >= 12) {
            profile.events[e].sessions[ev.sessions.length - 1].cavg12 = average(
              sols,
              12
            );
            if (len == 12) {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg12 = average(sols, 12);
            } else {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg12 = Math.min(
                profile.events[e].sessions[ev.sessions.length - 1].bavg12,
                profile.events[e].sessions[ev.sessions.length - 1].cavg12
              );
            }
          }
          if (len >= 50) {
            profile.events[e].sessions[ev.sessions.length - 1].cavg50 = average(
              sols,
              50
            );
            if (len == 50) {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg50 = average(sols, 50);
            } else {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg50 = Math.min(
                profile.events[e].sessions[ev.sessions.length - 1].bavg50,
                profile.events[e].sessions[ev.sessions.length - 1].cavg50
              );
            }
          }
          if (len >= 100) {
            profile.events[e].sessions[
              ev.sessions.length - 1
            ].cavg100 = average(sols, 100);
            if (len == 100) {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg100 = average(sols, 100);
            } else {
              profile.events[e].sessions[
                ev.sessions.length - 1
              ].bavg100 = Math.min(
                profile.events[e].sessions[ev.sessions.length - 1].bavg100,
                profile.events[e].sessions[ev.sessions.length - 1].cavg100
              );
            }
          }
          await profile.save();
          res.json(profile.events[e].sessions[ev.sessions.length - 1]);
          break;
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/profile/session/:event
// @desc     Add a new solving session
// @access   Private

router.put('/session/:event', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    for (e in profile.events) {
      const ev = profile.events[e];
      if (ev.name === req.params.event) {
        profile.events[e].sessions.push({});
        await profile.save();
        return res.json(profile.events[e].sessions[ev.sessions.length - 1]);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile/solve/:event/:id
// @desc     Delete a solve
// @access   Private

router.delete('/solve/:event/:id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    for (e in profile.events) {
      const ev = profile.events[e];
      if (ev.name === req.params.event) {
        profile.events[e].sessions[ev.sessions.length - 1].solves = ev.sessions[
          ev.sessions.length - 1
        ].solves.filter(sol => sol._id.toString() !== req.params.id);
        profile.markModified('events'); //this tells mongoose to look for changes in events array
        await profile.save(); // saves changes to mongoose
        return res
          .status(200)
          .json(profile.events[e].sessions[ev.sessions.length - 1]);
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    DELETE api/profile/solve/:event
// @desc     Delete current session
// @access   Private

router.delete('/solve/:event/', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    for (e in profile.events) {
      const ev = profile.events[e];
      if (ev.name === req.params.event) {
        profile.events[e].sessions[ev.sessions.length - 1].solves = [];
        profile.markModified('events'); //this tells mongoose to look for changes in events array
        await profile.save(); // saves changes to mongoose
        return res.status(200).json(profile.events);
      }
    }
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
