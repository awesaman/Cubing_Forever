const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  wcaid: {
    type: String,
  },
  events: [
    {
      name: {
        type: String,
        required: true,
      },
      single: {
        type: String,
      },
      avg5: {
        type: String,
      },
      avg12: {
        type: String,
      },
      solves: [
        {
          time: { type: Number },
          scramble: { type: String },
        },
      ],
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
