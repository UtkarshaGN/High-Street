import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1f1b24] border-t border-gray-800 mt-auto">
      <div className="px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Footer Links */}
          <div className="flex gap-6 text-sm">
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-orange-500 transition"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-orange-500 transition"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} High Street Gym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}