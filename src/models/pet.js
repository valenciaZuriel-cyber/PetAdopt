const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dogbreed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Macho', 'Hembra'], required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  healtStatus: { type: String },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Pet', PetSchema);