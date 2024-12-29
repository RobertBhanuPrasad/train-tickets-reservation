import TicketBookingPage from "@/components/TicketsBooking";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Ticket Booking App</h1>
      <p className="text-lg text-white mb-8">
        Book tickets easily and manage your account with us!
      </p>
      <div><TicketBookingPage/></div>
    </div>
  );
}
