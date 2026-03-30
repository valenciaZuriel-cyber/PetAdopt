const mongoose = require('mongoose');

const AdoptionRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  motivo: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pendiente', 'aprobado', 'rechazado'], 
    default: 'pendiente' 
  }
});

module.exports = mongoose.model('AdoptionRequest', AdoptionRequestSchema);