const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  id: {
    type: Number
  },
  category: {
    type: String
  }
})

const Category = mongoose.model('category', categorySchema, 'categories');

module.exports = Category;