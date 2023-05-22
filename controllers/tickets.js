const uniqid = require("uniqid");
const UserModel = require("../models/user");
const TicketModel = require("../models/tickets");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
module.exports.INSERT_TICKET = async (req, res) => {
    try {
      const ticket = new TicketModel({
        id: uniqid(),
        title: req.body.title,
        ticket_price: req.body.ticket_price,
        from_location: req.body.from_location,
        to_location: req.body.to_location,
        to_location_photo_url: req.body.to_location_photo_url,
      });
  
      await ticket.save();
  
      res.status(200).json({ response: "Ticket was saved successfully" });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "Error occurred while saving the ticket" });
    }
  };
// BUY_TICKET,
//     GET_ALL_USERS_WITH_TICKETS,
//     GET_USER_BY_ID_WITH_TICKETS,