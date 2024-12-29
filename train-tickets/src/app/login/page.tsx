"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    
    try {
      // Send login request to the server
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",  // Ensure the method is POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId); 
        // If login is successful, redirect to the / page
        router.push("/");
      } else {
        // If there's an error, display the error message
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while logging in.");
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-blue-500">
      <h1 className="text-3xl font-bold mb-6 text-white">Login</h1>

      <form className="flex flex-col gap-6 w-full sm:w-80 bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-white">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-green-500 cursor-pointer hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
