const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    ref: 'category',
    type: Schema.Types.ObjectId
  },
  imageSrc: {
    type: String,
    default: "",
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ''
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

ProductSchema.index({ name: 'text', title: 'text' })

module.exports = mongoose.model('product', ProductSchema);
