const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Sweet', SweetSchema);
