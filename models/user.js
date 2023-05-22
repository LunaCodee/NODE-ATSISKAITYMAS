const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  id: { type: String, required: true, minlength: 3 },
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, minlength: 8 },
  password: { type: String, required: true, minlength: 6 },
  bought_tickets: { type: Array, required: true },
  money_balance: { type: Number, required: true },
});

module.exports = mongoose.model("User", UserSchema);