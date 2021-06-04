const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new mongoose.Schema({
  news: {
    date: { type: String },
    title: { type: String },
    count: { type: String },
    newsFeed: [
      {
        headLine: { type: String },
        description: { type: String },
        link: { type: String },
        category: [{ type: String }],
      },
    ],
  },
});

module.exports = mongoose.model('News', NewsSchema);
