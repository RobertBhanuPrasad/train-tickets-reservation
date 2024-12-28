export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-blue-500">
      <h1 className="text-3xl font-bold mb-6 text-white">Sign Up</h1>

      <form className="flex flex-col gap-6 w-full sm:w-80 bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="First Name"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm text-white">
        Already have an account?{' '}
        <span className="text-green-500 cursor-pointer hover:underline">
          Login
        </span>
      </p>
    </div>
  );
}
