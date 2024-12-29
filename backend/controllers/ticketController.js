const { Pool } = require("pg");

// Initialize the PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Fetch all tickets or filter by query parameters (e.g., train_name, user_id)
const getTickets = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id parameter." });
  }

  try {
    const query = `SELECT seat_number FROM tickets WHERE user_id = $1`;
    const result = await pool.query(query, [user_id]);

    const bookedSeats = result.rows.flatMap((row) => row.seat_number);
    res.status(200).json({ bookedSeats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets", details: err.message });
  }
};


// Fetch a specific ticket by ID
const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the ticket", details: err.message });
  }
};

// Book a new ticket
const bookTicket = async (req, res) => {
  const { seat_number, booking_date, user_id } = req.body;

  // Validate input
  if (!Array.isArray(seat_number) || seat_number.length === 0) {
    return res.status(400).json({ error: "Seat numbers must be a non-empty array." });
  }
  if (!booking_date || !user_id) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Serialize the seat_number array to a JSON string
    const serializedSeatNumber = JSON.stringify(seat_number);

    const result = await pool.query(
      `INSERT INTO tickets (seat_number, booking_date, user_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [serializedSeatNumber, booking_date, user_id]
    );

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to book ticket",
      details: err.message,
    });
  }
};


module.exports = { getTickets, getTicketById, bookTicket };
