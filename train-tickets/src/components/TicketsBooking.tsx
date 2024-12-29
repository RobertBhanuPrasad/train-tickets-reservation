"use client"
import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useRouter } from 'next/navigation';

const TicketBookingPage = () => {
    const router = useRouter();
    const totalSeats = 80;
    const rows = 12;
    const seatsInRow = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3]; // 12th row has 3 seats
    const [bookedTickets, setBookedTickets] = useState(0);
    const [availableTickets, setAvailableTickets] = useState(totalSeats);
    const [ticketsToBook, setTicketsToBook] = useState(0);
    const [error, setError] = useState("");
    const [seatMap, setSeatMap] = useState(generateSeatMap()); // Seat map to track availability
    const [user, setUser] = useState<string | null>(null); // Track current logged-in user
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);

    //it is used to fetch the data of the logged in user
    useEffect(() => {
        const fetchTickets = async () => {
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:5000/api/tickets?user_id=${user}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch tickets: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched data:", data); // This should log the fetched data

                // Assuming data.bookedSeats is an array of booked seat identifiers
                const bookedSeatsArray = data.bookedSeats || [];
                setBookedSeats(bookedSeatsArray);

                // Update seat map to mark booked seats
                const updatedSeatMap = generateSeatMap(bookedSeatsArray);
                setSeatMap(updatedSeatMap);

            } catch (error) {
                console.error("Error fetching tickets:", error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };

        fetchTickets();
    }, [user]);

    function generateSeatMap(bookedSeats: number[] = []): boolean[][] {
        const seatMap = [];
        for (let i = 0; i < rows; i++) {
            const rowSeats = [];
            for (let j = 0; j < seatsInRow[i]; j++) {
                rowSeats.push(bookedSeats.includes(i * 7 + j + 1)); // Mark as booked if in bookedSeats
            }
            seatMap.push(rowSeats);
        }
        return seatMap;
    }

    //tickets booking function
    const handleBooking = async () => {
        const storedUserId = localStorage.getItem("userId");
        if (!user) {
            setError("Please log in to book tickets.");
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
                    let count = 0;
                    for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
                        if (!rowSeats[seatIndex] && count < ticketsToBook) {
                            rowSeats[seatIndex] = true; // Book this seat
                            newlyBookedSeats.push(rowIndex * 7 + seatIndex + 1);
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

        if (!booked) {
            let remainingSeatsToBook = ticketsToBook;

            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                const rowSeats = seatMap[rowIndex];
                for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
                    if (!rowSeats[seatIndex] && remainingSeatsToBook > 0) {
                        rowSeats[seatIndex] = true; // Book this seat
                        newlyBookedSeats.push(rowIndex * 7 + seatIndex + 1);
                        remainingSeatsToBook--;
                    }
                }
                if (remainingSeatsToBook === 0) break;
            }

            if (remainingSeatsToBook === 0) {
                setBookedTickets(bookedTickets + ticketsToBook);
                setAvailableTickets(availableTickets - ticketsToBook);
            } else {
                setError("Not enough adjacent seats available.");
                return;
            }
        }

        setBookedSeats([...bookedSeats, ...newlyBookedSeats]); // Add newly booked seats
        setTicketsToBook(0);
        setError("");

        // POST booked tickets to the database
        try {
            const response = await fetch("http://localhost:5000/api/tickets/bootTicket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: storedUserId,  // Assuming `user` contains the user's data, and `id` is the user's unique ID
                    seat_number: newlyBookedSeats,
                    booking_date: new Date().toISOString(), // Use current date as booking date
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to book tickets.");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred during booking.");
            }
        }
    };


    const handleReset = async () => {
        try {
            const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

            if (!userId) {
                setError("User ID is not available. Please log in again.");
                return;
            }

            // Call the API to delete all tickets for the user
            const response = await fetch("http://localhost:5000/api/tickets/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to reset tickets.");
                return;
            }

            // Reset the state
            setSeatMap(generateSeatMap());
            setBookedTickets(0);
            setAvailableTickets(totalSeats);
            setTicketsToBook(0);
            localStorage.clear(); // Clears all keys and values in Local Storage
            window.location.reload();
            setError("");
        } catch (err) {
            console.error("Error resetting tickets:", err);
            setError("An error occurred while resetting tickets.");
        }
    };


    const handleLogin = () => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUser(storedUserId); // Set user ID in state
        } else {
            router.push("/login");
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSeatMap(generateSeatMap());
        setBookedSeats([]);
        setBookedTickets(0);
        setAvailableTickets(totalSeats);
        localStorage.clear(); // Clears all keys and values in Local Storage
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Ticket Booking</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {!user ? (
                <div className="text-center">
                    <Button onClick={() => handleLogin()} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                        Login
                    </Button>
                </div>
            ) : (
                <div className="text-center">
                    <h4>Welcome - user no. : {user}</h4>
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
                            <strong>Booked Tickets:</strong> {bookedTickets} {bookedSeats?.length}
                        </div>
                        <div className="flex items-center justify-center w-60 h-12 bg-green-500 text-black font-bold rounded-lg">
                            <strong>Available Tickets:</strong> {availableTickets} {80 - bookedSeats?.length}
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
                                className="w-full md:w-52 p-2 border rounded-md text-black"
                            />
                            <Button
                                variant="success"
                                onClick={handleBooking}
                                className="ml-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded-lg"
                            >
                                Book Tickets
                            </Button>
                        </div>
                    </div>

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

                    {/* Reset */}
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        className="px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 rounded-lg"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TicketBookingPage;