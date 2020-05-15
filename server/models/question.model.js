const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    category: {
      type: String,
    },
    difficulty: {
      type: Number,
    },
    question: {
      type: String,
    },
    incorrect_answers: {
      type: [String]
    },
    correct_answer: {
      type: String
    }
  },
  {time: {type: Date, default: Date.now}}
);

const Question = mongoose.model('question', questionSchema);

module.exports = Question;
