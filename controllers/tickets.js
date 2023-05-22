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


module.exports.BUY_TICKET = async (req, res) => {
    try {
      const userId = req.body.userId;
      const ticketId = req.body.ticketId;
      console.log(userId,ticketId)
  
      const ticket = await TicketModel.findOne({ id: ticketId });
    
      if (!ticket) {
        return res.status(404).json({ response: "Ticket not found" });
      }
      const user = await UserModel.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ response: "User not found" });
      }
    
      const ticketPrice = ticket.ticket_price;
      const userBalance = user.money_balance;
      console.log(ticketPrice,userBalance)

      if (userBalance < ticketPrice) {
        return res.status(400).json({ response: "Insufficient balance to buy the ticket" });
      }
    

      user.money_balance -= ticketPrice;
      user.bought_tickets.push(ticketId);
      await user.save();

      res.status(200).json({ response: "You have bought ticket successfully" });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "Internal Server Error" });
    }
  };   

  module.exports.GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
    try {
      const aggregatedUserData = await UserModel.aggregate([
        {
          $unwind: "$bought_tickets"
        },
        {
          $lookup: {
            from: "tickets",
            localField: "bought_tickets",
            foreignField: "id",
            as: "user_tickets",
          },
        },
        {
          $group: {
            _id: "$_id",
            id: { $first: "$id" },
            name: { $first: "$name" },
            email: { $first: "$email" },
            password: { $first: "$password" },
            bought_tickets: { $push: "$user_tickets" },
            money_balance: { $first: "$money_balance" },
          }
        }
      ]).exec();
  
      res.status(200).json({ users: aggregatedUserData });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };

  module.exports.GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
      
  try {
    const userId = req.body.userId;
    const aggregatedUserData = await UserModel.aggregate([
      {
        $unwind: "$bought_tickets"
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "user_tickets",
        },
      },
      {
        $group: {
          _id: "$_id",
          id: { $first: "$id" },
          name: { $first: "$name" },
          email: { $first: "$email" },
          password: { $first: "$password" },
          bought_tickets: { $push: "$user_tickets" },
          money_balance: { $first: "$money_balance" },
        }
      },
        { $match: { id: userId } },
      
    ]).exec();

    res.status(200).json({ users: aggregatedUserData });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};