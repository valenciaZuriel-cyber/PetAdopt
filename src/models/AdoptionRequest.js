const mongoose = require('mongoose');

const AdoptionRequestSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  motive: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pendiente', 'aprobado', 'rechazado'], 
    default: 'pendiente' 
  }
});

module.exports = mongoose.model('AdoptionRequest', AdoptionRequestSchema);