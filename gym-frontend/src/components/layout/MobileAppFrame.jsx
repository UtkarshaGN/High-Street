import BottomNavbar from "./../common/BottomNavbar.jsx";
import { useAuth } from "../../context/AuthContext";


export default function MobileAppFrame({ children }) {

  const { isAuthenticated} = useAuth();


  return (
    <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center px-4">
      <div className="w-full max-w-[390px] h-[780px] bg-black rounded-[40px] shadow-2xl border border-gray-800 overflow-hidden relative">
        
        {/* App Header */}
        <div className="h-12 flex items-center justify-center text-sm font-bold text-orange-500 border-b border-gray-800">
          <a href="/" className="text-orange-500">GYMPRO</a>
        </div>

        {/* logout button */}
        <div className="absolute top-4 right-4">
  {isAuthenticated ? (
    <button
      onClick={() => {
        localStorage.removeItem("auth");
        window.location.href = "/";
      }}
      className="text-xs text-gray-400 hover:text-red-500 transition"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => {
        window.location.href = "/login";
      }}
      className="text-xs text-gray-400 hover:text-blue-500 transition"
    >
      Login
    </button>
  )}
</div>


        {/* Scrollable Content */}
        <div className="h-[calc(100%-112px)] overflow-y-auto">
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>
    </div>
  );
}
