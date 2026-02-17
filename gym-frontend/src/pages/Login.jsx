import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);

      // redirect based on role
      navigate("/sessions");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] px-4 py-6">
      {/* Home Button - Mobile Friendly */}
      <Link 
        to="/" 
        className="inline-flex items-center text-orange-500 hover:text-orange-400 font-semibold mb-8"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
        Back to Home
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1f1b24] p-6 rounded-xl w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm bg-red-500/10 p-3 rounded">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded transition">
          Login
        </button>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}