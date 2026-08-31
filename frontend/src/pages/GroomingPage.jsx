import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function GroomingPage() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);

  const [petId, setPetId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("pets/")
      .then((response) => {
        setPets(
          response.data.results || response.data
        );
      })
      .catch((error) => {
        console.error(
          "Unable to load pets:",
          error.response?.data || error.message
        );
      });

    api
      .get("grooming/services/")
      .then((response) => {
        setServices(
          response.data.results || response.data
        );
      })
      .catch((error) => {
        console.error(
          "Unable to load grooming services:",
          error.response?.data || error.message
        );
      });
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const data = {
        pet: petId,
        service: serviceId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: notes,
      };

      const response = await api.post(
        "grooming/bookings/",
        data
      );

      console.log(
        "Grooming booking created:",
        response.data
      );

      alert(
        "Grooming appointment booked successfully!"
      );

      navigate("/grooming/bookings");

    } catch (error) {
      console.error(
        "Unable to book grooming:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Unable to book grooming appointment."
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "700px" }}
    >
      <h2 className="mb-4">
        Book Grooming Service
      </h2>

      <form onSubmit={handleBooking}>

        {/* Pet */}
        <div className="mb-3">
          <label className="form-label">
            Select Pet
          </label>

          <select
            className="form-select"
            value={petId}
            onChange={(e) =>
              setPetId(e.target.value)
            }
            required
          >
            <option value="">
              Select your pet
            </option>

            {pets.map((pet) => (
              <option
                key={pet.id}
                value={pet.id}
              >
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service */}
        <div className="mb-3">
          <label className="form-label">
            Grooming Service
          </label>

          <select
            className="form-select"
            value={serviceId}
            onChange={(e) =>
              setServiceId(e.target.value)
            }
            required
          >
            <option value="">
              Select grooming service
            </option>

            {services.map((service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.name} - ₹{service.price}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">
            Booking Date
          </label>

          <input
            type="date"
            className="form-control"
            value={bookingDate}
            onChange={(e) =>
              setBookingDate(e.target.value)
            }
            required
          />
        </div>

        {/* Time */}
        <div className="mb-3">
          <label className="form-label">
            Booking Time
          </label>

          <input
            type="time"
            className="form-control"
            value={bookingTime}
            onChange={(e) =>
              setBookingTime(e.target.value)
            }
            required
          />
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="form-label">
            Notes
          </label>

          <textarea
            className="form-control"
            rows="3"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Any special instructions..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={submitting}
        >
          {submitting
            ? "Booking..."
            : "Book Grooming Service"}
        </button>

      </form>
    </div>
  );
}

export default GroomingPage;