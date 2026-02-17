import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import { apiRequest } from "../services/api.jsx";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [bookingIds, setBookingIds] = useState([]); // Track sessions being booked
  const [showAll, setShowAll] = useState(false);


  const [startDate, setStartDate] = useState(""); // start date filter
  const [endDate, setEndDate] = useState(""); // end date filter

  const {isAuthenticated,user} = useAuth();
  const isTrainer = user?.role === "trainer";

  const formatDate = (date) => date.toISOString().split("T")[0];

  const localStorageItem = localStorage.getItem("auth");
  const role = localStorageItem ? JSON.parse(localStorageItem).role : null;
  const userId = localStorageItem ? JSON.parse(localStorageItem).userId : null;

  console.log("User role from localStorage:", role);

  useEffect(() => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  setStartDate(formatDate(today));
  setEndDate(formatDate(nextWeek));
}, []);

  // Fetch sessions
   const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (!showAll) {
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
      }

      if (role === "trainer") {
        params.append("trainerId", userId);
      }

      console.log("Fetching sessions with params:", params.toString());
      if(!showAll && !startDate && !endDate){
        return 
      };
      var endpoint;
      if(showAll){
        endpoint = "/sessions";
      } else {
         endpoint = `/sessions?${params.toString()}`;
      }
      // const endpoint = params.toString()
      //   ? `/sessions?${params.toString()}`
      //   : "/sessions";

      console.log("Fetching:", endpoint);

      const data = await apiRequest(endpoint, { method: "GET" });
      setSessions(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
  fetchSessions();
}, [startDate, endDate, showAll]);


  // Export sessions as XML
  // UI function
const handleExport = async () => {
  if (!isAuthenticated) {
    toast.error("You must be logged in to export sessions");
    return;
  }

  try {
    setExporting(true);
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    // const queryString = params.toString();
    const endpoint =  "/xml/sessions";

    // Fetch as text
    const response = await apiRequest(endpoint, {
      method: "GET",
      responseType: "text", // <--- use text, not blob
    });

    // Convert text to blob manually
    const blob = new Blob([response], { type: "application/xml" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sessions_${startDate || "all"}_${endDate || "all"}_${new Date()
      .toISOString()
      .split("T")[0]}.xml`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
    toast.success("Sessions exported successfully!");
  } catch (err) {
    console.error("Error exporting sessions:", err);
    toast.error(err);
  } finally {
    setExporting(false);
  }
};


  // Book a session
  const handleBookSession = async (sessionId) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to book a session");
      return;
    }
    try {
      setBookingIds((prev) => [...prev, sessionId]);

      await apiRequest("/bookings", {
        method: "POST",
        body: { sessionId },
      });

      toast.success("Session booked successfully!");
    } catch (err) {
      console.error("Error booking session:", err);
      toast.error(err);
    } finally {
      setBookingIds((prev) => prev.filter((id) => id !== sessionId));
    }
  };

const handleCancelSession = async (sessionId) => {
  if (!isAuthenticated) {
    toast.error("You must be logged in to cancel a session");
    return;
  }
  try {
    await apiRequest(`/sessions/${sessionId}`, {
      method: "DELETE",
    });

    toast.success("Session canceled successfully!");
    fetchSessions();
    // Refresh sessions after cancellation
    // setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
  }
    catch (err) {
      console.error("Error canceling session:", err);
      toast.error(err);
    }
  };


  if (loading) return <p className="text-center mt-10">Loading sessions...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Weekly Timetable</h2>

{isAuthenticated && (
        <button
          onClick={handleExport}
          disabled={exporting}
          className="text-sm bg-accent text-black px-4 py-2 rounded-full font-semibold disabled:opacity-50"
        >
          {exporting ? "Exporting…" : "Export XML"}
        </button>
)}
      </div>

      <div className="flex items-center gap-3">
  <span className="text-sm text-gray-400">Show All Sessions</span>
  <button
    onClick={() => setShowAll((prev) => !prev)}
    className={`w-12 h-6 rounded-full transition relative ${
      showAll ? "bg-accent" : "bg-gray-600"
    }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
        showAll ? "left-7" : "left-1"
      }`}
    />
  </button>
</div>


      {/* Date Range Filter */}
      <div className="bg-[#1f1f1f] rounded-2xl p-4 space-y-3">
        <p className="text-sm text-gray-400">Filter by date</p>

        <div className="flex gap-2">
          <input
            type="date"
            disabled={showAll}
            className="flex-1 bg-black border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            disabled={showAll}
            className="flex-1 bg-black border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-xs text-gray-400 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {!loading && sessions.length === 0 && (
        <div className="text-center text-gray-400 mt-10">No sessions available</div>
      )}

      {/* Sessions List */}
      <div className="space-y-4 pb-24">
        {sessions.map((session) => {
          const isBooking = bookingIds.includes(session.sessionId);
          const isPastSession = new Date(session.sessionDate).setHours(0, 0, 0, 0) <  new Date().setHours(0, 0, 0, 0);

          return (
            <div
              key={session.sessionId}
              className="bg-[#1f1f1f] rounded-2xl p-4 space-y-2"
            >
              {/* Title + Time */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">{session.activityName}</h3>
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {session.startTime} – {session.endTime}
                </span>
              </div>

              {/* Meta Info */}
              <p className="text-xs text-gray-400">📍 {session.locationName}</p>
              <p className="text-xs text-gray-400">🧑‍🏫 {session.trainerName}</p>
              <p className="text-xs text-gray-500">📅 {session.sessionDate}</p>

              {/* Book Button */}
              {isAuthenticated && (
  <button
    onClick={() =>
      isTrainer
        ? handleCancelSession(session.sessionId)
        : handleBookSession(session.sessionId)
    }
    disabled={isBooking || isPastSession}
    className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold transition
      ${
        isPastSession
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : isTrainer
          ? "bg-red-500 text-white active:scale-95"
          : "bg-accent text-black active:scale-95"
      }
      disabled:opacity-50`}
  >
    {isPastSession
      ? "Past Session"
      : isTrainer
      ? "Cancel Session"
      : isBooking
      ? "Booking…"
      : "Book Session"}
  </button>
)}

        

            </div>
          );
        })}
      </div>
    </div>
  );
}
