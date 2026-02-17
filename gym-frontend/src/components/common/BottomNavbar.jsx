
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaDumbbell, FaCalendarAlt, FaUser, FaBlog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, ready, user} = useAuth();

  if (!ready) return null;

  // Hide bottom nav on auth pages
  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  const navItem = (path, Icon) => {
    const isActive = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center text-xs transition
          ${isActive ? "text-orange-500" : "text-gray-400"}
        `}
      >
        <Icon className="text-lg mb-1" />
      </button>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex justify-around items-center">
      
      {/* Always Visible */}
      {navItem("/", FaHome)}

      {/* Logged In & NOT Trainer (Normal Member) */}
  {isAuthenticated && user?.role !== "trainer" && (
    <>
      {navItem("/sessions", FaDumbbell)}
      {navItem("/bookings", FaCalendarAlt)}
      {navItem("/microblog", FaBlog)}
      {navItem("/profile", FaUser)}

    </>
  )}

  {/* Logged In & Trainer */}
  {isAuthenticated && user?.role === "trainer" && (
    <>
      {navItem("/sessions", FaDumbbell)}
      {navItem("/microblog", FaBlog)}
      {navItem("/profile", FaUser)}
    </>
  )}



      
    </div>
  );
}



// import { useLocation, useNavigate } from "react-router-dom";
// import { FaHome, FaDumbbell, FaCalendarAlt, FaUser, FaBlog } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";

// export default function BottomNavbar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { isAuthenticated, ready } = useAuth();

//   // Prevent auth flash (same as Navbar)
//   if (!ready) return null;

//   // Hide bottom nav on auth pages
//   if (["/login", "/register"].includes(location.pathname)) {
//     return null;
//   }

//   const handleNavigation = (path, isProtected = false) => {
//     if (isProtected && !isAuthenticated) {
//       navigate("/login");
//     } else {
//       navigate(path);
//     }
//   };

//   const navItem = (path, Icon, isProtected = false) => {
//     const isActive = location.pathname === path;

//     return (
//       <button
//         onClick={() => handleNavigation(path, isProtected)}
//         className={`flex flex-col items-center justify-center text-xs transition
//           ${isActive ? "text-orange-500" : "text-gray-400"}
//           ${!isAuthenticated && isProtected ? "opacity-60" : ""}
//         `}
//       >
//         <Icon className="text-lg mb-1" />
//       </button>
//     );
//   };

//   return (
//     <div className="absolute bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex justify-around items-center">
//       {navItem("/", FaHome)}
//       {navItem("/sessions", FaDumbbell, false)}
//       {navItem("/bookings", FaCalendarAlt, true)}
//       {navItem("/microblog", FaBlog, false)}
//       {navItem("/profile", FaUser, true)}
//     </div>
//   );
// }
