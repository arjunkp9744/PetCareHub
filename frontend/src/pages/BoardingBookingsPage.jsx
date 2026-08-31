import { useEffect, useState } from "react";
import api from "../services/api";

function BoardingBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get(
        "boarding/bookings/"
      );

      const data =
        response.data.results ||
        response.data;

      setBookings(data);
    } catch (error) {
      console.error(
        "Unable to load bookings:",
        error.response?.data || error.message
      );

      setError(
        "Unable to load your boarding bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.post(
      `boarding/bookings/${bookingId}/cancel/`
      );

      await loadBookings();
    } catch (error) {
      console.error(
        "Unable to cancel booking:",
        error.response?.data || error.message
      );

      alert(
        "Unable to cancel the booking."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading your bookings...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1>🏠 My Boarding Bookings</h1>

        <p className="text-muted">
          View and manage your pet boarding reservations.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center mt-5">

          <h4>No boarding bookings yet.</h4>

          <p className="text-muted">
            Book a comfortable stay for your pet.
          </p>

        </div>
      ) : (
        <div className="row">

          {bookings.map((booking) => (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={booking.id}
            >

              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-start">

                    <h5 className="card-title">
                      🐾 {booking.pet_name}
                    </h5>

                    <span
                      className={`badge ${
                        booking.status === "CONFIRMED"
                          ? "bg-success"
                          : booking.status === "CANCELLED"
                          ? "bg-danger"
                          : booking.status === "COMPLETED"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  <hr />

                  <p className="mb-2">
                    <strong>Facility:</strong>{" "}
                    {booking.facility_name}
                  </p>

                  <p className="mb-2">
                    <strong>Check-in:</strong>{" "}
                    {booking.check_in_date}
                  </p>

                  <p className="mb-2">
                    <strong>Check-out:</strong>{" "}
                    {booking.check_out_date}
                  </p>

                  <p className="mb-2">
                    <strong>Total:</strong>{" "}
                    <span className="text-success fw-bold">
                      ₹{booking.total_amount}
                    </span>
                  </p>

                  {booking.special_instructions && (
                    <p className="text-muted">
                      <strong>Instructions:</strong>{" "}
                      {booking.special_instructions}
                    </p>
                  )}

                  {booking.status !== "CANCELLED" &&
                    booking.status !== "COMPLETED" && (
                      <button
                        className="btn btn-outline-danger w-100 mt-3"
                        onClick={() =>
                          handleCancel(booking.id)
                        }
                      >
                        Cancel Booking
                      </button>
                    )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default BoardingBookingsPage;