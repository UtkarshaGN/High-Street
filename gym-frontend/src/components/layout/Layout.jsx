import { Outlet } from "react-router-dom";
import MobileAppFrame from "./MobileAppFrame";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <MobileAppFrame>
      <div className="flex flex-col min-h-full">
        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </MobileAppFrame>
  );
}