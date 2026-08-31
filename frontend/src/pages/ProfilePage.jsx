import { useEffect, useState } from "react";
import api from "../services/api";
import "./ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get(
        "accounts/profile/"
      );

      setProfile(response.data);

      setFormData({
        full_name:
          response.data.full_name || "",
        phone:
          response.data.phone || "",
        address:
          response.data.address || "",
        city:
          response.data.city || "",
        state:
          response.data.state || "",
        pincode:
          response.data.pincode || "",
      });

    } catch (error) {
      console.error(
        "Unable to load profile:",
        error.response?.data || error.message
      );

      setError(
        "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await api.put(
        "accounts/profile/",
        formData
      );

      setProfile(response.data.user);

      setSuccess(
        "Profile updated successfully! ✅"
      );

    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );

      const data = error.response?.data;

      if (typeof data === "object") {
        setError(
          Object.values(data)
            .flat()
            .join(" ")
        );
      } else {
        setError(
          "Unable to update your profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <h3>Loading profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <div className="profile-header">

          <div className="profile-avatar">
            {profile?.full_name
              ?.charAt(0)
              ?.toUpperCase() || "👤"}
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your PetCare Hub account
              information.
            </p>
          </div>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="profile-card">

          <form onSubmit={handleSubmit}>

            <div className="profile-section">

              <h4>Personal Information</h4>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    className="form-control profile-input"
                    value={formData.full_name}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control profile-input"
                    value={profile?.email || ""}
                    disabled
                  />

                  <small className="text-muted">
                    Email cannot be changed.
                  </small>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control profile-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Account Role
                  </label>

                  <input
                    type="text"
                    className="form-control profile-input"
                    value={profile?.role || ""}
                    disabled
                  />

                  <small className="text-muted">
                    Role is managed by the system.
                  </small>

                </div>

              </div>

            </div>

            <div className="profile-section">

              <h4>Address Information</h4>

              <div className="mb-3">

                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control profile-input"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>

              <div className="row">

                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    className="form-control profile-input"
                    value={formData.city}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    className="form-control profile-input"
                    value={formData.state}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    className="form-control profile-input"
                    value={formData.pincode}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            <div className="profile-actions">

              <button
                type="submit"
                className="btn btn-primary profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;