// userRoutes.js
const express = require("express");
const { signup, getUsers, login } = require("../controllers/userController");

const router = express.Router();

// POST route for signup
router.post("/signup", signup);

router.post("/login", login)

// GET route to fetch all users (you might not need this for production)
router.get("/", getUsers);

module.exports = router;
