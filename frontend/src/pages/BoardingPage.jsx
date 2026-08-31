
import { useEffect, useState } from "react";
import api from "../services/api";
import "./BoardingPage.css";

function BoardingPage() {
  const [facilities, setFacilities] = useState([]);
  const [pets, setPets] = useState([]);

  const [facility, setFacility] = useState("");
  const [pet, setPet] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facilityResponse, petResponse] =
          await Promise.all([
            api.get("boarding/facilities/"),
            api.get("pets/"),
          ]);

        const facilityData =
          facilityResponse.data.results ||
          facilityResponse.data;

        const petData =
          petResponse.data.results ||
          petResponse.data;

        setFacilities(facilityData);
        setPets(petData);
      } catch (error) {
        console.error(
          "Unable to load boarding data:",
          error.response?.data || error.message
        );

        setError(
          "Unable to load boarding facilities or pets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedFacility = facilities.find(
    (item) => String(item.id) === String(facility)
  );

  const calculateDays = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference =
      end.getTime() - start.getTime();

    const days =
      difference / (1000 * 60 * 60 * 24);

    return days > 0 ? days : 0;
  };

  const days = calculateDays();

  const estimatedTotal =
    selectedFacility && days
      ? Number(selectedFacility.price_per_day) * days
      : 0;

  const handleBooking = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!pet || !facility || !checkIn || !checkOut) {
      setError(
        "Please select your pet, facility, and dates."
      );
      return;
    }

    if (days <= 0) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    setBooking(true);

    try {
      await api.post(
        "boarding/bookings/",
        {
          pet: pet,
          facility: facility,
          check_in_date: checkIn,
          check_out_date: checkOut,
          special_instructions: instructions,
        }
      );

      setMessage(
        "Boarding booking created successfully! 🐾"
      );

      setPet("");
      setFacility("");
      setCheckIn("");
      setCheckOut("");
      setInstructions("");

    } catch (error) {
      console.error(
        "Booking error:",
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
          "Unable to create boarding booking."
        );
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="boarding-page">
        <div className="container">
          <div className="text-center py-5">
            <h3>Loading boarding facilities...</h3>
            <p className="text-muted">
              Please wait a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boarding-page">

      <div className="container">

        {/* Hero */}

        <div className="boarding-hero">

          <h1>
            🐾 Pet Boarding
          </h1>

          <p>
            Give your pet a safe, comfortable,
            and loving place to stay while
            you're away.
          </p>

        </div>

        {/* Messages */}

        {message && (
          <div
            className="alert alert-success shadow-sm"
            role="alert"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger shadow-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="row g-4">

          {/* Facilities */}

          <div className="col-lg-7">

            <div className="mb-4">

              <h3 className="fw-bold mb-1">
                Available Boarding Facilities
              </h3>

              <p className="text-muted mb-0">
                Choose a comfortable place
                for your pet.
              </p>

            </div>

            <div className="row g-4">

              {facilities.length === 0 ? (

                <div className="col-12">

                  <div className="boarding-empty">

                    <div
                      style={{
                        fontSize: "40px",
                        marginBottom: "10px",
                      }}
                    >
                      🏠
                    </div>

                    <h5>
                      No facilities available
                    </h5>

                    <p className="text-muted mb-0">
                      There are currently no
                      active boarding facilities.
                    </p>

                  </div>

                </div>

              ) : (

                facilities.map((item) => {

                  const selected =
                    String(facility) ===
                    String(item.id);

                  return (
                    <div
                      className="col-md-6"
                      key={item.id}
                    >

                      <div
                        className={`facility-card ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setFacility(item.id)
                        }
                      >

                        <div className="facility-card-body">

                          <div className="facility-icon">
                            🏠
                          </div>

                          <h5 className="facility-name">
                            {item.name}
                          </h5>

                          <div className="facility-city">
                            📍 {item.city}
                          </div>

                          <p className="facility-description">
                            {item.description ||
                              "A safe and comfortable boarding facility for your pet."}
                          </p>

                          <p className="text-muted mb-2">
                            📍 {item.address}
                          </p>

                          <p className="text-muted mb-3">
                            📞 {item.phone}
                          </p>

                          <div className="d-flex justify-content-between align-items-center">

                            <div className="facility-price">
                              ₹{item.price_per_day}
                              <small>
                                {" "}
                                / day
                              </small>
                            </div>

                            {selected && (
                              <span className="badge bg-primary selected-badge">
                                ✓ Selected
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })

              )}

            </div>

          </div>

          {/* Booking Form */}

          <div className="col-lg-5">

            <div className="card boarding-booking-card">

              <div className="card-body">

                <h3 className="boarding-booking-title">
                  Book a Stay
                </h3>

                <form onSubmit={handleBooking}>

                  {/* Pet */}

                  <div className="mb-4">

                    <label className="form-label boarding-label">
                      🐾 Select Your Pet
                    </label>

                    <select
                      className="form-select boarding-input"
                      value={pet}
                      onChange={(event) =>
                        setPet(event.target.value)
                      }
                    >

                      <option value="">
                        Choose your pet
                      </option>

                      {pets.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* Facility */}

                  <div className="mb-4">

                    <label className="form-label boarding-label">
                      🏠 Boarding Facility
                    </label>

                    <select
                      className="form-select boarding-input"
                      value={facility}
                      onChange={(event) =>
                        setFacility(event.target.value)
                      }
                    >

                      <option value="">
                        Choose a facility
                      </option>

                      {facilities.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name} — ₹
                          {item.price_per_day}/day
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* Dates */}

                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label boarding-label">
                        📅 Check-in
                      </label>

                      <input
                        type="date"
                        className="form-control boarding-input"
                        value={checkIn}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) =>
                          setCheckIn(
                            event.target.value
                          )
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label boarding-label">
                        📅 Check-out
                      </label>

                      <input
                        type="date"
                        className="form-control boarding-input"
                        value={checkOut}
                        min={
                          checkIn ||
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) =>
                          setCheckOut(
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* Instructions */}

                  <div className="mb-4">

                    <label className="form-label boarding-label">
                      📝 Special Instructions
                    </label>

                    <textarea
                      className="form-control boarding-input"
                      rows="4"
                      placeholder="Food preferences, medication reminders, special care..."
                      value={instructions}
                      onChange={(event) =>
                        setInstructions(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  {/* Price Summary */}

                  {days > 0 &&
                    selectedFacility && (

                    <div className="boarding-summary mb-4">

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Stay duration
                        </span>

                        <strong>
                          {days} day
                          {days !== 1
                            ? "s"
                            : ""}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-3">

                        <span>
                          Rate
                        </span>

                        <span>
                          ₹
                          {
                            selectedFacility.price_per_day
                          }
                          /day
                        </span>

                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">

                        <span className="fw-semibold">
                          Estimated Total
                        </span>

                        <span className="boarding-total">
                          ₹
                          {estimatedTotal.toFixed(
                            2
                          )}
                        </span>

                      </div>

                    </div>
                  )}

                  {/* Submit */}

                  <button
                    type="submit"
                    className="btn btn-primary boarding-book-button w-100"
                    disabled={booking}
                  >
                    {booking
                      ? "🐾 Booking..."
                      : "🏠 Book Boarding"}
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BoardingPage;
