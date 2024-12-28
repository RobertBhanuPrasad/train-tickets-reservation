// ticketRoutes.js
const express = require("express");
const { getTrains, bookTicket } = require("../controllers/ticketController");

const router = express.Router();

router.get("/", getTrains); // Fetch available trains
router.post("/", bookTicket); // Book a ticket

module.exports = router;
