const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema({
  id: { type: String, required: true, min: 7 },
  title: { type: String, required: true, min: 3 },
  ticket_price: { type: Number, required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true},
  to_location_photo_url: { type: String, required: true},
});

module.exports = mongoose.model("ticket", TicketSchema);