// ticketController.js
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all trains
const getTrains = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Book a ticket
const bookTicket = async (req, res) => {
  const { train_name, seat_number, booking_date, user_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO tickets (train_name, seat, travel_date, user_id) VALUES ($1, $2, $3, $4)",
      [train_name, seat_number, booking_date, user_id]
    );
    res.status(201).json({ message: "Ticket booked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTrains, bookTicket };
