"use client"
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
  
    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    setError(""); // Clear previous errors
  
    try {
      // Make sure the URL matches your backend route structure
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });
  
      if (!response.ok) {
        // Handle specific server response status codes
        const errorData = await response.json(); // Parse error response
  
        // Check for validation error (status code 400)
        if (response.status === 400) {
          setError(errorData.message || "Validation failed.");
          return;
        }
  
        // Handle internal server error (status code 500)
        if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
  
        // Handle other non-successful responses
        throw new Error(errorData.message || "Failed to sign up. Please try again.");
      }
  
      const data = await response.json();
      alert("User registered successfully!");
      console.log(data);
  
      // You can reset formData or redirect the user after successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      // Display user-friendly error message
      console.error("Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-blue-500">
      <h1 className="text-3xl font-bold mb-6 text-white">Sign Up</h1>

      <form
        className="flex flex-col gap-6 w-full sm:w-80 bg-white p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm text-white">
        Already have an account?{" "}
        <a href="/login" className="text-green-500 cursor-pointer hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
