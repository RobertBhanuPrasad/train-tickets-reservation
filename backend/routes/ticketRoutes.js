const express = require("express");
const { getTickets } = require("../controllers/ticketController");

const router = express.Router();

router.get("/", getTickets);

module.exports = router; 
