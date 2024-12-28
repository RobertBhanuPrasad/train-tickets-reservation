const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Database connected successfully:", res.rows);
  }

  // Close the pool only after the query is complete
  // pool.end((endErr) => {
  //   if (endErr) {
  //     console.error("Error closing the pool:", endErr.stack);
  //   } else {
  //     console.log("Database pool has been closed.");
  //   }
  // });
});

module.exports = pool;
