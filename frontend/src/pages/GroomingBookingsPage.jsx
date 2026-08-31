import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function GroomingBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("grooming/bookings/")
      .then((response) => {
        const bookingData =
          response.data.results || response.data;

        setBookings(bookingData);
      })
      .catch((error) => {
        console.error(
          "Unable to load grooming bookings:",
          error.response?.data || error.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading grooming bookings...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Grooming Bookings</h2>

        <button
          className="btn btn-success"
          onClick={() => navigate("/grooming")}
        >
          + Book Grooming
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          You don't have any grooming bookings yet.
        </div>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div
              className="col-md-6 mb-4"
              key={booking.id}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h5 className="card-title">
                    {booking.pet_name}
                  </h5>

                  <p>
                    <strong>Service:</strong>{" "}
                    {booking.service_name}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    ₹{booking.service_price}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {booking.booking_date}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {booking.booking_time}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-primary">
                      {booking.status}
                    </span>
                  </p>

                  {booking.notes && (
                    <p className="text-muted">
                      <strong>Notes:</strong>{" "}
                      {booking.notes}
                    </p>
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

export default GroomingBookingsPage;