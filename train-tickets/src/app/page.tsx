import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-black">Welcome to Ticket Booking App</h1>
      <p className="text-lg text-gray-600 mb-8">
        Book tickets easily and manage your account with us!
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="bg-blue-500 text-white py-2 px-4 rounded">
          Sign Up
        </Link>
        <Link href="/login" className="bg-green-500 text-white py-2 px-4 rounded">
          Log In
        </Link>
        <Link href="/tickets" className="bg-purple-500 text-white py-2 px-4 rounded">
          Book Tickets
        </Link>
      </div>
    </div>
  );
}
