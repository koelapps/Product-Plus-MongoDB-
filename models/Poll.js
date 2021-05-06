const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new mongoose.Schema({
  question: String,
  answer: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Poll', PollSchema);
