const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Ensure this points to your database config

// Signup function
const signup = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    // Validate input
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the email already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Check if the phone number already exists
    const phoneCheck = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ message: "Phone number is already in use" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone, password) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, email, phone, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
};


// Get users function (for your existing GET route)
const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, first_name, last_name, email, phone FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error while fetching users");
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Fetch user from the database based on the email
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Ensure that JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    console.log(secret, "secretkey")
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not defined." });
    }

    // Generate JWT token (You can adjust this as per your needs)
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to log in. Please try again." });
  }
};


module.exports = { signup, login, getUsers };
