const mongoose = require('mongoose');

const ValidationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ingresos: { type: Number, required: true }, 
  tienePatio: { type: Boolean, required: true }, 
  observaciones: { type: String }
});

module.exports = mongoose.model('Validation', ValidationSchema);