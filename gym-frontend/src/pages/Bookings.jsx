import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import { apiRequest } from "../services/api.jsx";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [selectedDate, setSelectedDate] = useState(""); // Date filter
    const {isAuthenticated} = useAuth();

    

  // Fetch bookings from API with date filter
  useEffect(() => {
    fetchBookings();
  }, [selectedDate]); // Re-fetch when date filter changes

  const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Build query parameter for date filtering
        const endpoint = selectedDate 
          ? `/bookings?date=${selectedDate}` 
          : "/bookings";
        
        const data = await apiRequest(endpoint, { method: "GET" });
        const filtered = (data || []).filter(
          (booking) => booking.status && booking.status !== "null"
        );

        setBookings(filtered);

        // setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

  // Cancel a booking
  const handleCancel = async (bookingId) => {
    try {
      await apiRequest(`/bookings/${bookingId}`, { method: "DELETE" });
      // setBookings((prev) =>
      //   prev.filter((booking) => booking.booking_id !== bookingId)
      // );
      toast.success("Booking cancelled successfully!");
      await fetchBookings();
    } catch (err) {
      console.error("Error canceling booking:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  // Export bookings as XML
  const handleExport = async () => {
  if (!isAuthenticated) {
    toast.error("You must be logged in to export bookings.");
    return;
  }

  try {
    setExporting(true);

    const endpoint = selectedDate
      ? `/xml/bookings?date=${selectedDate}`
      : "/xml/bookings";

    // Fetch the XML as a blob
    const blob = await apiRequest(endpoint, {
      method: "GET",
      responseType: "blob",
    });

    // Generate a safe download URL
    const url = window.URL.createObjectURL(blob);
    const fileName = `bookings_${selectedDate || "all"}_${new Date()
      .toISOString()
      .split("T")[0]}.xml`;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);

    toast.success(`Bookings exported successfully as ${fileName}`);
  } catch (err) {
    console.error("Error exporting bookings:", err);
    toast.error("Failed to export bookings.");
  } finally {
    setExporting(false);
  }
};



  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
  <div className="px-4 py-4 space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">My Bookings</h2>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="text-sm bg-accent text-black px-4 py-2 rounded-full font-semibold disabled:opacity-50"
      >
        {exporting ? "Exporting…" : "Export XML"}
      </button>
    </div>

    {/* Date Filter */}
    <div className="bg-[#1f1f1f] rounded-2xl p-4 space-y-3">
      <label className="text-sm text-gray-400">Filter by date</label>

      <div className="flex gap-2">
        <input
          type="date"
          className="flex-1 bg-black border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="px-3 py-2 text-sm bg-gray-800 rounded-xl"
          >
            Clear
          </button>
        )}
      </div>
    </div>

    {/* Content */}
    {loading && (
      <p className="text-center text-gray-400 mt-10">
        Loading bookings…
      </p>
    )}

    {error && (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    )}

    {!loading && bookings.length === 0 && (
      <div className="text-center text-gray-400 mt-10">
        No bookings found
      </div>
    )}

    {/* Booking List */}
    <div className="space-y-4 pb-20">
     {bookings.map((booking) => {
  const today = new Date().toISOString().split("T")[0];
  const isPastSession = booking.sessionDate <= today;
  console.log("Booking session date:", booking.sessionDate, "Today:", today, "Is past:", isPastSession);
  const isCanceled = booking.status === "Canceled";
  {/* const isBooked = booking.status === "booked"; */}

  return (
    <div
      key={booking.booking_id}
      className="bg-[#1f1f1f] rounded-2xl p-4 space-y-3"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm">
          {booking.activityName}
        </h3>

        {/* Status Badge */}
       {/*old here logic } <span
          className={`text-xs px-3 py-1 rounded-full ${
            isCanceled
              ? "bg-red-500/20 text-red-400"
              : isPastSession
              ? "bg-gray-600/20 text-gray-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {isPastSession ? "Past Bookings" : booking.status}
        </span>*/}

        <span
  className={`text-xs px-3 py-1 rounded-full ${
    isCanceled
      ? "bg-red-500/20 text-red-400"
      : isPastSession
      ? "bg-gray-600/20 text-gray-400"
      : "bg-green-500/20 text-green-400"
  }`}
>
  {isCanceled
    ? "Canceled"
    : isPastSession
    ? "Past Booking"
    : "Confirmed"}
</span>
      </div>

      {/* Date & Time */}
      <p className="text-xs text-gray-400">
        {booking.sessionDate} • {booking.startTime}
      </p>

      {/* User */}
      <p className="text-xs text-gray-500">
        {booking.firstName} {booking.lastName}
      </p>

      {/* Action Button */}
      {!isPastSession && (
        <button
          onClick={() => handleCancel(booking.bookingId)}
          className="mt-3 w-full py-2 rounded-xl text-sm font-semibold transition
            bg-orange-500 text-black active:scale-95"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
})}

    </div>
  </div>
);
}