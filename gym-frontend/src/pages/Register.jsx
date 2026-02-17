import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "member"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await register(form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] px-4 py-6">
      {/* Home Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-orange-500 hover:text-orange-400 font-semibold mb-6"
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
          Join High Street Gym
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        <input
          type="tel"
          placeholder="Phone (10 digits)"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          pattern="[0-9]{10}"
          maxLength="10"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {/* Role Selection */}
        {/*<div className="mb-6">
          <label className="block text-gray-400 mb-2 text-sm">
            Register as
          </label>
          <select
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            required
          >
            <option value="member">Member</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>*/}

        <button 
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}