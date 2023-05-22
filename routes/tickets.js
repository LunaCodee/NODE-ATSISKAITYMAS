const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
    INSERT_TICKET,
    // BUY_TICKET,
    // GET_ALL_USERS_WITH_TICKETS,
    // GET_USER_BY_ID_WITH_TICKETS,
} = require("../controllers/tickets");

router.post("/insertTicket", INSERT_TICKET);
// router.post("/buyTicket", authMiddleware, BUY_TICKET);
// router.get("/getAllUsersWithTickets", authMiddleware, GET_ALL_USERS_WITH_TICKETS);
// router.get("/getUserByIdWithTickets", authMiddleware, GET_USER_BY_ID_WITH_TICKETS);

module.exports = router;