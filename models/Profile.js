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
      mo3: {
        type: String,
      },
      avg5: {
        type: String,
      },
      avg12: {
        type: String,
      },
      sessions: [
        {
          solves: [
            {
              time: { type: Number },
              scramble: { type: String },
              penalty: { type: String },
            },
          ],
          date: { type: Date, default: Date.now },
          cmo3: { type: Number },
          bmo3: { type: Number },
          cavg5: { type: Number },
          bavg5: { type: Number },
          cavg12: { type: Number },
          bavg12: { type: Number },
          cavg50: { type: Number },
          bavg50: { type: Number },
          cavg100: { type: Number },
          bavg100: { type: Number },
          mean: { type: Number },
          numsolves: { type: Number },
        },
      ],
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
