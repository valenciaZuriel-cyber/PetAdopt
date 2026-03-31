const mongoose = require('mongoose');

const ValidationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, required: true }, 
  haveyard: { type: Boolean, required: true }, 
  observations: { type: String }
});

module.exports = mongoose.model('Validation', ValidationSchema);