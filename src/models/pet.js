const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  especie: { type: String, required: true },
  age: { type: String, required: true },
  description: { type: String, required: true },
  estadoSalud: { type: String } 
});

module.exports = mongoose.model('Pet', PetSchema);