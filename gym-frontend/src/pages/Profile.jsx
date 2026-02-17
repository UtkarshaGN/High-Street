import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.jsx";
import toast from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
//loads user data

  const fetchProfile = async () => {
    try {
      const userData = await apiRequest("/users/profile", {
        method: "GET",
      });
      setProfile(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        password: "", // blank initially
      });

    } catch (error) {
      // console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile.", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");

      // Remove password if left blank
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const updatedUser = await apiRequest("/users/me", {
        method: "PATCH",
        body: payload,
      });
//added Updates the profile state,Turns off edit mode
//Refetches data
// So details show again.
      setProfile(updatedUser);
      setEditing(false);
      toast.success("Profile updated successfully!");

      await fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile.", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading profile...</div>;
  if (!profile)
    return (
      <div className="text-center mt-10 text-red-500">Profile not found</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-black border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-500">My Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="border border-orange-500 px-4 py-2 rounded hover:bg-orange-500"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <p className="text-gray-400">First Name</p>
          {editing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">{profile.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <p className="text-gray-400">Last Name</p>
          {editing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">{profile.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <p className="text-gray-400">Phone</p>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">{profile.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <p className="text-gray-400">Password</p>
          {editing ? (
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">****</p>
          )}
        </div>

        {/* Role (read-only) */}
        <div>
          <p className="text-gray-400">Role</p>
          <p className="text-lg capitalize">{profile.role}</p>
        </div>

        {/* Joined Date */}
        {profile.created_at && (
          <div>
            <p className="text-gray-400">Joined On</p>
            <p className="text-lg">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {editing && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-orange-500 px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => {
//Resets form back to existing profile data
//Prevents empty fields.
              setEditing(false);
              setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                password: "",
              });
            }}
            className="border border-gray-600 px-6 py-2 rounded hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
