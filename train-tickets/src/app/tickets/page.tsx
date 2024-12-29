"use client";
import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useRouter } from 'next/navigation';;

const TicketBookingPage = () => {
  const router = useRouter()
  const totalSeats = 80;
  const rows = 12;
  const seatsInRow = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3]; // 12th row has 3 seats
  const [bookedTickets, setBookedTickets] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(totalSeats);
  const [ticketsToBook, setTicketsToBook] = useState(0);
  const [error, setError] = useState("");
  const [seatMap, setSeatMap] = useState(generateSeatMap()); // Seat map to track availability
  const [user, setUser] = useState(null); // Track current logged-in user
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);

  function generateSeatMap() {
    const seatMap = [];
    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      for (let j = 0; j < seatsInRow[i]; j++) {
        rowSeats.push(false); // False means the seat is available
      }
      seatMap.push(rowSeats);
    }
    return seatMap;
  }

  // Book tickets function
  const handleBooking = () => {
    if (!user) {
      setError("Please log in to book tickets.");
      router.push("/login"); // Redirect to login page
      return;
    }
    if (ticketsToBook <= 0) {
      setError("Please enter a valid number of tickets to book.");
      return;
    } else if (ticketsToBook > availableTickets) {
      setError("Not enough available tickets.");
      return;
    }

    let booked = false;
    const newlyBookedSeats = [];

    // Try to book tickets row by row
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const rowSeats = seatMap[rowIndex];

      // Check if we can book all tickets in one row
      if (seatsInRow[rowIndex] === 7) {
        const availableSeatsInRow = rowSeats.filter((seat) => !seat);
        if (availableSeatsInRow.length >= ticketsToBook) {
          // Book the tickets in this row
          let count = 0;
          for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
            if (!rowSeats[seatIndex] && count < ticketsToBook) {
              rowSeats[seatIndex] = true; // Book this seat
              newlyBookedSeats.push(rowIndex * 7 + seatIndex + 1); // Add booked seat number to the array
              count++;
            }
          }
          setBookedTickets(bookedTickets + ticketsToBook);
          setAvailableTickets(availableTickets - ticketsToBook);
          booked = true;
          break;
        }
      }
    }

    // Fallback to nearby seats if we can't book in a single row
    if (!booked) {
      let remainingSeatsToBook = ticketsToBook;
      let bookedSeats = 0;

      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const rowSeats = seatMap[rowIndex];

        for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
          if (!rowSeats[seatIndex] && remainingSeatsToBook > 0) {
            rowSeats[seatIndex] = true; // Book this seat
            newlyBookedSeats.push(rowIndex * 7 + seatIndex + 1); // Add booked seat number
            bookedSeats++;
            remainingSeatsToBook--;
          }
        }

        if (remainingSeatsToBook === 0) break;
      }

      if (bookedSeats === ticketsToBook) {
        setBookedTickets(bookedTickets + bookedSeats);
        setAvailableTickets(availableTickets - bookedSeats);
      } else {
        setError("Not enough adjacent seats available.");
      }
    }

    setBookedSeats(newlyBookedSeats); // Update booked seats after booking
    setTicketsToBook(0);
    setError(""); // Clear error on successful booking
  };


  // Reset booking function
  const handleReset = () => {
    setSeatMap(generateSeatMap());
    setBookedTickets(0);
    setAvailableTickets(totalSeats);
    setTicketsToBook(0);
    setError(""); // Clear error when resetting
  };

  // Login and Signup functions (basic example)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = (username: any) => {
    setUser(username);
    router.push("/login")
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Ticket Booking</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!user ? (
        <div className="text-center">
          <Button onClick={() => handleLogin("user123")} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
            Login
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h4>Welcome, {user}</h4>
          <Button variant="danger" onClick={handleLogout} className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg">
            Logout
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:space-x-12 mt-4">
        {/* Left side: Ticket grid */}
        <div className="flex-1">
          <div className="ticket-grid">
            {/* The grid of 80 seats */}
            <div className="row flex flex-wrap justify-center">
              {Array.from({ length: 11 }).map((_, rowIndex) => {
                // Each row will have 7 seats
                const rowSeats = seatMap[rowIndex];
                return (
                  <div key={rowIndex} className="flex mb-2">
                    {rowSeats.slice(0, 7).map((seat, seatIndex) => {
                      const seatNumber = rowIndex * 7 + seatIndex + 1;
                      return (
                        <div
                          key={seatNumber}
                          className="w-12 h-12 flex items-center justify-center m-1 font-bold rounded-lg"
                          style={{
                            backgroundColor: seat ? "yellow" : "green", // Yellow for booked, green for available
                            color: "black",
                          }}
                        >
                          {seatNumber}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* The 12th row with only 3 seats */}
              <div className="flex mb-2">
                {Array.from({ length: 3 }).map((_, index) => {
                  const seatNumber = 77 + index + 1; // For the last 3 seats, starting from seat 78
                  return (
                    <div
                      key={seatNumber}
                      className="w-12 h-12 flex items-center justify-center m-1 font-bold rounded-lg"
                      style={{
                        backgroundColor: seatMap[11][index] ? "yellow" : "green", // Yellow for booked, green for available
                        color: "black",
                      }}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Display the booking status */}
          <div className="flex gap-6 mt-4 justify-center sm:justify-center">
            <div className="flex items-center justify-center w-60 h-12 bg-yellow-500 text-black font-bold rounded-lg">
              <strong>Booked Tickets:</strong> {bookedTickets}
            </div>
            <div className="flex items-center justify-center w-60 h-12 bg-green-500 text-black font-bold rounded-lg">
              <strong>Available Tickets:</strong> {availableTickets}
            </div>
          </div>
        </div>

        {/* Right side: Booking form and controls */}
        <div className="flex flex-col justify-start space-y-4 mt-4 md:mt-0">
          {/* Book Seats */}
          <strong className="text-lg font-semibold mr-4">Book Seats:</strong>
          <div className="flex items-center">
            <div className="flex items-center w-full">
              <Form.Control
                type="number"
                placeholder="Enter number of tickets"
                value={ticketsToBook}
                onChange={(e) => setTicketsToBook(Number(e.target.value))}
                className="w-full md:w-52 p-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                variant="primary"
                onClick={handleBooking}
                className="ml-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded-lg"
              >
                Book
              </Button>
            </div>
          </div>

          {/* Display booked seats */}
          {bookedSeats.length > 0 && (
            <div className="flex mt-4">
              <strong>Booked Seats:</strong>
              <div className="ml-4 flex flex-wrap gap-2">
                {bookedSeats.map((seat) => (
                  <div key={seat} className="w-12 h-12 flex items-center justify-center m-1 font-bold text-white bg-yellow-500 rounded-lg">
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset button */}
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 rounded-lg"
            >
              Reset Booking
            </Button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default TicketBookingPage;
