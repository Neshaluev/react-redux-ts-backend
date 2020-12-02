const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryShema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: "",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

CategoryShema.index({ name: 'text', title: 'text', description: 'text' })

module.exports = mongoose.model('category', CategoryShema);
