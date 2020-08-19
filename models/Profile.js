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
          worst: { type: Number },
          best: { type: Number },
          cmo3: { type: Number },
          bmo3: { type: Number },
          bmo3loc: { type: Number },
          cavg5: {},
          bavg5: {},
          bavg5loc: { type: Number },
          cavg12: {},
          bavg12: {},
          bavg12loc: { type: Number },
          cavg50: {},
          bavg50: {},
          bavg50loc: { type: Number },
          cavg100: {},
          bavg100: {},
          bavg100loc: { type: Number },
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
