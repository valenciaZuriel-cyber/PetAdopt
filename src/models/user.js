const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  ingresos: { type: Number, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tienePatio: { type: Boolean, default: false },  
  isAdmin: { type: Boolean, default: false }      
});

module.exports = mongoose.model('User', UserSchema);