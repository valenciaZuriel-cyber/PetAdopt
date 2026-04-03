const mongoose = require('mongoose');

const AdoptionRequestSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  motive: { type: String, required: true }, 
  status: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' },
  // Validaciones integradas
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, required: true }, 
  haveyard: { type: Boolean, required: true }, 
  observations: { type: String }
});

module.exports = mongoose.model('AdoptionRequest', AdoptionRequestSchema);