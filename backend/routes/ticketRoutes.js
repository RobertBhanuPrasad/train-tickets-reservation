const express = require("express");
const { getTickets, getTicketById, bookTicket } = require("../controllers/ticketController");

const router = express.Router();

// Fetch all tickets or filter by query parameters
router.get("/", getTickets);

// Fetch a specific ticket by ID
router.get("/:id", getTicketById);

// Book a new ticket
router.post("/bootTicket", bookTicket);

module.exports = router;
