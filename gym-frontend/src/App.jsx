import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Sessions from "./pages/Sessions.jsx";
import Bookings from "./pages/Bookings.jsx";
import Microblog from "./pages/Microblog.jsx";
import Profile from "./pages/Profile.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/layout/Footer.jsx";

export default function App() {
  return (
    <>
<Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f1f1f",
            color: "#fff",
          },
        }}
      />
   
    <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

          
      <Route element={<ProtectedRoute />}>
        <Route path="/sessions" element={<Sessions />} />
          <Route path="/microblog" element={<Microblog />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
     </>
  );
}
