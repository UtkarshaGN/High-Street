import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { user, logout, isAuthenticated,ready } = useAuth();
  console.log("Navbar - Authenticated user:", user);
  const navigate = useNavigate();

  if (!ready) return null; // prevents flash

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };  

  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-orange-500">
        GYM<span className="text-white">PRO</span>
      </Link>

      {/* Links */}
      <div className="flex gap-6 items-center">
        {!isAuthenticated && (
          <>
            <Link to="/login" className="hover:text-orange-400">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
            >
              Join Now
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/sessions" className="hover:text-orange-400">
              Sessions
            </Link>

            <Link to="/bookings" className="hover:text-orange-400">
              My Bookings
            </Link>

            <Link to="/microblog" className="hover:text-orange-400">
              Blogs
            </Link>

{/* Profile Icon */}
            <Link to="/profile" className="text-2xl hover:text-orange-400">
              <FaUserCircle />
            </Link>


            <button
              onClick={handleLogout}
              className="border border-orange-500 px-4 py-2 rounded hover:bg-orange-500"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
