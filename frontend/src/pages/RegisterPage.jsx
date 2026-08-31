import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirm_password
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("accounts/register/", {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      const data = error.response?.data;

      if (typeof data === "object") {
        setError(
          Object.entries(data)
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(" ")
                : messages;

              return `${field}: ${message}`;
            })
            .join(" ")
        );
      } else {
        setError(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-card">

          <div className="register-header">
            <div className="register-icon">
              🐾
            </div>

            <h1>Create Your Account</h1>

            <p>
              Join PetCare Hub and take better
              care of your pets.
            </p>
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

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-12 mb-3">

                <label className="form-label">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="full_name"
                  className="form-control register-input"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control register-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control register-input"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control register-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Confirm Password *
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  className="form-control register-input"
                  placeholder="Confirm password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control register-input"
                  rows="2"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  className="form-control register-input"
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
                  className="form-control register-input"
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
                  className="form-control register-input"
                  value={formData.pincode}
                  onChange={handleChange}
                />

              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary register-button w-100"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="login-link"
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;